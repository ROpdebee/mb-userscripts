// @ts-expect-error rewired
import { __get__ } from '../../build/plugin-userscript';


describe('git URLs', () => {
    const GitURLs = __get__('GitURLs');

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
    const MetadataGenerator = __get__('MetadataGenerator');
    const options = {
        userscriptName: 'test',
        outputDir: 'dist',
        include: /.+/,
        branchName: 'branch',
        metadataOrder: ['name', 'namespace', 'version'],
    };

    describe('creating metadata line', () => {
        const metaGen = new MetadataGenerator(options);

        it('concatenates field and value', () => {
            const line = metaGen.createMetadataLine('namespace', 'test_namespace');

            expect(line).toBe('@namespace  test_namespace');
        });

        it('pads short fields', () => {
            const line = metaGen.createMetadataLine('name', 'test_name');

            expect(line).toBe('@name       test_name');
        });
    });

    describe('creating metadata lines', () => {
        const metaGen = new MetadataGenerator(options);

        it('generates a single line', () => {
            const lines = metaGen.createMetadataLines(['name', 'test1']);

            expect(lines).toStrictEqual(['@name       test1']);
        });

        it('generates multiple lines', () => {
            const lines = metaGen.createMetadataLines(['name', ['test1', 'test2']]);

            expect(lines).toStrictEqual(['@name       test1', '@name       test2']);
        });
    });

    describe('creating metadata block', () => {
        const metaGen = new MetadataGenerator(options);

        it('wraps stanzas in userscript metadata block', () => {
            const block = metaGen.createMetadataBlock({ name: 'test' });

            expect(block).toBe(`
// ==UserScript==
// @name       test
// ==/UserScript==`.trim());
        });

        it('sorts entries according to field order', () => {
            const block = metaGen.createMetadataBlock({ version: '1.2.3', namespace: 'ns', name: 'name' });

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
            });
            const block = metaGen.createMetadataBlock({ version: '1.2.3', namespace: 'ns', name: 'name' });

            expect(block).toBe(`
// ==UserScript==
// @version    1.2.3
// @namespace  ns
// @name       name
// ==/UserScript==`.trim());
        });
    });
});
