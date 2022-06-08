import fs from 'fs';
import path from 'path';

import { generateChangelogEntry, parseChangelogEntries, parsePullRequestTitle, updateChangelog } from '../../../build/changelog';

describe('parsing PR title', () => {
    const ccTypes = ['feat', 'fix', 'docs', 'test', 'refactor', 'style', 'chore'];

    it.each(ccTypes)('parses CC titles of type %s without scope', async (ccType) => {
        const prInfo = {
            title: `${ccType}: test subject`,
            number: 123,
            labels: [],
            url: 'testurl',
        };

        await expect(parsePullRequestTitle(prInfo)).resolves.toStrictEqual({
            type: ccType,
            subject: 'test subject',
        });
    });

    it.each(ccTypes)('parses CC titles of type %s with scope', async (ccType) => {
        const prInfo = {
            title: `${ccType}(test scope): test subject`,
            number: 123,
            labels: [],
            url: 'testurl',
        };

        await expect(parsePullRequestTitle(prInfo)).resolves.toStrictEqual({
            type: ccType,
            subject: 'test subject',
        });
    });

    it('rejects PR titles without CC type', async () => {
        const prInfo = {
            title: 'test subject',
            number: 123,
            labels: [],
            url: 'testurl',
        };

        await expect(parsePullRequestTitle(prInfo)).rejects.toThrowWithMessage(Error, 'Could not parse pull request title');
    });
});

describe('generating changelog entry', () => {
    const typesAndTitles = [{
        type: 'feat',
        title: 'New feature',
    }, {
        type: 'fix',
        title: 'Bug fix',
    }, {
        type: 'perf',
        title: 'Performance improvements',
    }, {
        type: 'refactor',
        title: 'Internal changes',
    }];

    it.each(typesAndTitles)('uses correct title for type $type', async ({ type, title }) => {
        const prInfo = {
            title: `${type}: test change`,
            number: 123,
            labels: [],
            url: 'testurl',
        };

        await expect(generateChangelogEntry('1.2.3', prInfo)).resolves
            .toBe(`- **1.2.3**: ${title}: test change ([#123](testurl))`);
    });
});

describe('updating changelog', () => {
    const changelogReaderMock = jest.spyOn(fs.promises, 'readFile');
    const changelogWriterMock = jest.spyOn(fs.promises, 'writeFile');
    const prInfo = {
        title: 'feat(ecau): test provider',
        number: 123,
        labels: [],
        url: 'testurl',
    };
    const expectedChangelog = '- **1.2.3**: New feature: test provider ([#123](testurl))\n';
    const expectedPath = path.join('testRepo', 'testScript.changelog.md');

    beforeEach(() => {
        changelogWriterMock.mockResolvedValue(undefined);
    });

    afterEach(() => {
        changelogReaderMock.mockReset();
        changelogWriterMock.mockReset();
    });

    it('generates new changelog if none exists', async () => {
        changelogReaderMock.mockRejectedValue(new Error('File not found'));
        await updateChangelog('testScript', '1.2.3', 'testRepo', prInfo);

        expect(changelogWriterMock).toHaveBeenCalledTimes(1);
        expect(changelogWriterMock).toHaveBeenCalledWith(expectedPath, expectedChangelog);
    });

    it('prepends existing changelog if one exists', async () => {
        changelogReaderMock.mockResolvedValue('Existing\nchangelog\ncontent');
        await updateChangelog('testScript', '1.2.3', 'testRepo', prInfo);

        expect(changelogWriterMock).toHaveBeenCalledTimes(1);
        expect(changelogWriterMock).toHaveBeenCalledWith(expectedPath, expectedChangelog + 'Existing\nchangelog\ncontent');
    });
});

describe('parsing changelog', () => {
    const changelogReaderMock = jest.spyOn(fs.promises, 'readFile');
    const changelogWriterMock = jest.spyOn(fs.promises, 'writeFile');

    beforeEach(() => {
        changelogWriterMock.mockResolvedValue(undefined);
    });

    afterEach(() => {
        changelogReaderMock.mockReset();
        changelogWriterMock.mockReset();
    });

    it('returns no entries on empty changelog', async () => {
        changelogReaderMock.mockRejectedValue(new Error('File not found'));

        await expect(parseChangelogEntries('test')).resolves.toStrictEqual([]);
    });

    it('parses previously-generated changelogs', async () => {
        changelogReaderMock.mockRejectedValue(new Error('File not found'));
        await updateChangelog('testScript', '1.2.3', 'testRepo', {
            title: 'feat(ecau): add Jamendo provider',
            number: 123,
            labels: [],
        });
        // @ts-expect-error: Mocking
        changelogReaderMock.mockResolvedValue(changelogWriterMock.mock.lastCall[1]);
        await updateChangelog('testScript', '1.2.3.1', 'testRepo', {
            title: 'fix(ecau): fix a mistake!!',
            number: 124,
            labels: [],
        });
        // @ts-expect-error: Mocking
        changelogReaderMock.mockResolvedValue(changelogWriterMock.mock.lastCall[1]);

        await expect(parseChangelogEntries('test')).resolves.toStrictEqual([{
            title: 'Bug fix',
            version: '1.2.3.1',
            subject: 'fix a mistake!!',
            prNumber: 124,
        }, {
            title: 'New feature',
            version: '1.2.3',
            subject: 'add Jamendo provider',
            prNumber: 123,
        }]);
    });

    it('ignores malformed entries', async () => {
        changelogReaderMock.mockResolvedValue('not a correct\nchangelog');

        await expect(parseChangelogEntries('test')).resolves.toStrictEqual([]);
    });
});
