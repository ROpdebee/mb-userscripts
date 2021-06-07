/* https://github.com/violentmonkey/generator-userscript/blob/13c163828402ee8f3ae05b695ad4e3959d59ed55/lib/generators/app/templates/src/types/css.d.ts */

declare module '*.module.css' {
  /**
   * Generated CSS for CSS modules
   */
  export const stylesheet: string;

  /**
   * Exported classes
   */
  const classMap: Record<string, string>;

  export default classMap;
}

declare module '*.css' {

  /**
   * Generated CSS
   */
  const css: string;

  export default css;
}

declare module '*.module.scss' {
  /**
   * Generated CSS for CSS modules
   */
  export const stylesheet: string;

  /**
   * Exported classes
   */
  const classMap: Record<string, string>;

  export default classMap;
}

declare module '*.scss' {

  /**
   * Generated CSS
   */
  const css: string;

  export default css;
}
