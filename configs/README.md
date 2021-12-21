# Configurations

## Typescript

This project uses multiple TypeScript subprojects to enforce separation of
source code, utility code, and tests. For example, we use a separate TS project
for `src/lib` to enforce that `lib` code cannot depend on script code.
Similarly, we separate unit test code from source code to ensure we cannot
accidentally import test code into script code.

The main benefit of this separation is that we can isolate global ambient type
declarations for each subproject. For example, we can globally include the
type declarations for `jest` (e.g. `describe`, `it`, and `expect`) in unit
test code, without making it available to script source code, where `jest` will
not be available. This also prevents code completion suggestions where they are
not applicable. This can also help to prevent conflicting type declarations,
e.g. two separate testing frameworks that both provide a global `describe`
function with conflicting signatures.

The main drawback of this approach is the large number of `tsconfig.json` files
it creates. Each separate subproject contains its own `tsconfig.json` with its
specific settings, such as globally available type declarations, path mappings
(e.g. from `@lib` to `src/lib` for scripts), etc. This directory aggregates a
number of auxiliary `tsconfig.json` files, falling into one of two categories.

### 1. Extensible base configurations

These define default configuration values for certain types of projects and can
be extended via `tsconfig`'s `extends` value. We define a number of these base
configurations:

* [`tsconfig.base`](./tsconfig.base.json) is the core configuration defining
  all default options for all subprojects. It is further split into various
  extended reusable configurations for certain types of subprojects. _Note: The
  default configuration assumes that the extending projects will be composite
  projects. Certain options may need to be overridden for non-composite,
  non-emitted projects._
* [`tsconfig.base-composite`](./tsconfig.base-composite.json) extends the above
  purely to disable loading ambient declarations by default, thereby forcing
  each subproject to define its default ambient declarations explicitly. This
  is not done in `tsconfig.base` since it is also extended by non-composite
  projects which may need to load all ambient declarations (e.g.
  `tsconfig.glue-eslint`, described below).
* [`tsconfig.base-web`](./tsconfig.base-web.json) defines the default
  configuration for source code targetting browsers, such as `src/lib` and all
  userscript sources. It sets some default ES library options and makes sure
  necessary ambient declarations are available.
* [`tsconfig.base-node`](./tsconfig.base-node.json) defines the default
  configuration for source code to be run on NodeJS, like the build scripts and
  unit tests.
* [`tsconfig.base-unit`](./tsconfig.base-unit.json) defines the default
  configuration for unit test code, e.g. including `jest`'s global declarations
  by default.

### 2. Aggregate/glue projects

These serve to aggregate the different subprojects so we can compile/lint all
sources with one tool invocation.

* [`tsconfig.glue-composite`](./tsconfig.glue-composite.json) is the main
  aggregate project for use by TypeScript itself, i.e. the `tsc` compiler, for
  type checking. This is linked to `tsconfig.json` in the project root.
* [`tsconfig.glue-eslint`](./tsconfig.glue-eslint.json) is a configuration file
  provided for tools which do not properly support project references, like
  `@typescript-eslint`. It defines a standard, non-composite project which
  simply includes all files in the compilation, without isolating the
  subprojects.

