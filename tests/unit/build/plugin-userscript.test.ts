import type { AllUserscriptMetadata, UserscriptMetadata } from '@lib/util/metadata';

import { GitURLs, MetadataGenerator } from '../../../build/plugin-userscript';

describe('git URLs', () => {
    describe('constructor', () => {
        it('throw on invalid URL', () => {
            expect(() => new GitURLs('not a url'))
                .toThrow('Invalid URL');
        });

        it('throws on incomplete GitHub URL', () => {
            expect(() => new GitURLs('https://github.com/ROpdebee'))
                .toThrow('Malformed git URL');
        });
    });

    describe('homepage URL', () => {
        it('use owner and repo name', () => {
            const gitUrls = new GitURLs('https://github.com/ROpdebee/mb-userscripts');

            expect(gitUrls.homepageURL)
                .toBe('https://github.com/ROpdebee/mb-userscripts');
        });

        it('should remove .git suffix', () => {
            const gitUrls = new GitURLs('https://github.com/ROpdebee/mb-userscripts.git');

            expect(gitUrls.homepageURL)
                .toBe('https://github.com/ROpdebee/mb-userscripts');
        });
    });

    describe('issues URL', () => {
        it('use owner and repo name', () => {
            const gitUrls = new GitURLs('https://github.com/ROpdebee/mb-userscripts');

            expect(gitUrls.issuesURL)
                .toBe('https://github.com/ROpdebee/mb-userscripts/issues');
        });

        it('should remove .git suffix', () => {
            const gitUrls = new GitURLs('https://github.com/ROpdebee/mb-userscripts.git');

            expect(gitUrls.issuesURL)
                .toBe('https://github.com/ROpdebee/mb-userscripts/issues');
        });
    });

    describe('raw URL', () => {
        it('use owner and repo name', () => {
            const gitUrls = new GitURLs('https://github.com/ROpdebee/mb-userscripts');

            expect(gitUrls.constructRawURL('dist', 'test.user.js'))
                .toBe('https://raw.github.com/ROpdebee/mb-userscripts/dist/test.user.js');
        });

        it('use correct branch name', () => {
            const gitUrls = new GitURLs('https://github.com/ROpdebee/mb-userscripts');

            expect(gitUrls.constructRawURL('some-branch', 'test.user.js'))
                .toBe('https://raw.github.com/ROpdebee/mb-userscripts/some-branch/test.user.js');
        });
    });

    describe('blob URL', () => {
        it('creates correct URLs', () => {
            const gitUrls = new GitURLs('https://github.com/ROpdebee/mb-userscripts');

            expect(gitUrls.constructBlobURL('dist', 'README.md'))
                .toBe('https://github.com/ROpdebee/mb-userscripts/blob/dist/README.md');
        });
    });

    describe('creating from package.json', () => {
        it('should throw if no repository defined', () => {
            expect(() => GitURLs.fromPackageJson({}))
                .toThrow('No repository defined');
        });

        it('should construct from simple string', () => {
            const gitUrls = GitURLs.fromPackageJson({ repository: 'https://github.com/ROpdebee/mb-userscripts' });

            expect(gitUrls.homepageURL)
                .toBe('https://github.com/ROpdebee/mb-userscripts');
        });

        it('should construct from repo object', () => {
            const gitUrls = GitURLs.fromPackageJson({ repository: { type: 'git', url: 'https://github.com/ROpdebee/mb-userscripts' }});

            expect(gitUrls.homepageURL)
                .toBe('https://github.com/ROpdebee/mb-userscripts');
        });
    });
});

describe('metadata generator', () => {
    const options = {
        userscriptName: 'test',
        version: '1.0.0',
        outputDir: 'dist',
        include: /.+/,
        branchName: 'branch',
        metadataOrder: ['name', 'namespace', 'version'],
    };
    const basePackageJson = {
        repository: 'https://github.com/ROpdebee/mb-userscripts',
    };
    const packageJsonWithAuthor = {
        ...basePackageJson,
        author: 'ROpdebee',
    };

    // In the following, we call `createMetadataLine` by indexing, as this
    // removes the private modifier.

    describe('creating metadata line', () => {
        const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);

        it('concatenates field and value', () => {
            const line = metaGen['createMetadataLine']('namespace', 'test_namespace');

            expect(line).toBe('@namespace  test_namespace');
        });

        it('pads short fields', () => {
            const line = metaGen['createMetadataLine']('name', 'test_name');

            expect(line).toBe('@name       test_name');
        });
    });

    describe('creating metadata lines', () => {
        const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);

        it('generates a single line', () => {
            const lines = metaGen['createMetadataLines'](['name', 'test1']);

            expect(lines).toStrictEqual(['@name       test1']);
        });

        it('generates multiple lines', () => {
            const lines = metaGen['createMetadataLines'](['name', ['test1', 'test2']]);

            expect(lines).toStrictEqual(['@name       test1', '@name       test2']);
        });
    });

    describe('creating metadata block', () => {
        const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);

        it('wraps stanzas in userscript metadata block', () => {
            const block = metaGen['createMetadataBlock']({ name: 'test' } as AllUserscriptMetadata);

            expect(block).toBe(`
// ==UserScript==
// @name       test
// ==/UserScript==`.trim());
        });

        it('sorts entries according to field order', () => {
            const block = metaGen['createMetadataBlock']({ version: '1.2.3', namespace: 'ns', name: 'name' } as AllUserscriptMetadata);

            expect(block).toBe(`
// ==UserScript==
// @name       name
// @namespace  ns
// @version    1.2.3
// ==/UserScript==`.trim());
        });

        it('allows changing the metadata order', () => {
            const metaGen = new MetadataGenerator({
                ...options,
                metadataOrder: ['version', 'namespace', 'name'],
            }, packageJsonWithAuthor);
            const block = metaGen['createMetadataBlock']({ version: '1.2.3', namespace: 'ns', name: 'name' } as AllUserscriptMetadata);

            expect(block).toBe(`
// ==UserScript==
// @version    1.2.3
// @namespace  ns
// @name       name
// ==/UserScript==`.trim());
        });
    });

    describe('setting default metadata', () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const defaultMeta = {} as UserscriptMetadata;

        it('throws on empty author', () => {
            expect.assertions(1);

            const metaGen = new MetadataGenerator(options, basePackageJson);

            expect(() => metaGen['insertDefaultMetadata'](defaultMeta))
                .toThrowWithMessage(Error, /^No author set/);
        });

        it('uses author string in package.json', () => {
            const metaGen = new MetadataGenerator(options, { ...basePackageJson, author: 'ROpdebee' });

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({ author: 'ROpdebee' });
        });

        it('uses author object in package.json', () => {
            const metaGen = new MetadataGenerator(options, { ...basePackageJson, author: { name: 'ROpdebee' }});

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({ author: 'ROpdebee' });
        });

        it('inserts license', () => {
            const metaGen = new MetadataGenerator(options, { ...packageJsonWithAuthor, license: 'MIT' });

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({ license: 'MIT' });
        });

        it('inserts namespace', () => {
            const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({ namespace: 'https://github.com/ROpdebee/mb-userscripts' });
        });

        it('inserts homepage URL', () => {
            const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({ homepageURL: 'https://github.com/ROpdebee/mb-userscripts' });
        });

        it('inserts issues URL from git repo', () => {
            const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({ supportURL: 'https://github.com/ROpdebee/mb-userscripts/issues' });
        });

        it('inserts issues URL from package.json bugs', () => {
            const metaGen = new MetadataGenerator(options, { ...packageJsonWithAuthor, bugs: 'test URL' });

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({ supportURL: 'test URL' });
        });

        it('inserts issues URL from package.json bugs object', () => {
            const metaGen = new MetadataGenerator(options, { ...packageJsonWithAuthor, bugs: { url: 'test URL' }});

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({ supportURL: 'test URL' });
        });

        it('inserts download and update URL', () => {
            const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);
            const urlBase = 'https://raw.github.com/ROpdebee/mb-userscripts/branch/';

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({
                    downloadURL: urlBase + 'test.user.js',
                    updateURL: urlBase + 'test.meta.js',
                });
        });

        it('inserts @grant none by default', () => {
            const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);

            expect(metaGen['insertDefaultMetadata'](defaultMeta))
                .toMatchObject({
                    grant: ['none'],
                });
        });

        it('allows overriding @grant none', () => {
            const metaGen = new MetadataGenerator(options, packageJsonWithAuthor);

            expect(metaGen['insertDefaultMetadata']({ ...defaultMeta, grant: ['GM_xmlhttpRequest'] }))
                .toMatchObject({
                    grant: ['GM_xmlhttpRequest', 'GM.xmlHttpRequest'],
                });
        });
    });
});
