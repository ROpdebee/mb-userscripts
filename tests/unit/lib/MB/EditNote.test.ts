import { EditNote } from '@lib/MB/EditNote';

// eslint-disable-next-line @typescript-eslint/init-declarations
let textarea: HTMLTextAreaElement;

beforeEach(() => {
    document.body.innerHTML = '<textarea class="edit-note" />';
    textarea = document.body.querySelector<HTMLTextAreaElement>('textarea')!;
});

describe('adding extra info', () => {
    it('adds the info line', () => {
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');

        expect(textarea.value.trim()).toBe('info line');
    });

    it('retains edit note content added after instantiation', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble';
        editNote.addExtraInfo('info line');

        expect(textarea.value).toBe('preamble\ninfo line');
    });

    it('retains edit note content added before instantiation', () => {
        textarea.value = 'preamble';
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');

        expect(textarea.value.trim()).toBe('preamble\ninfo line');
    });

    it('filters out duplicate lines', () => {
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');
        editNote.addExtraInfo('info line');

        expect(textarea.value.trim()).toBe('info line');
    });

    it('retains different lines', () => {
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');
        editNote.addExtraInfo('info line 2');

        expect(textarea.value.trim()).toBe('info line\ninfo line 2');
    });

    it('filters out pre-existing duplicates', () => {
        textarea.value = 'info line';
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');

        expect(textarea.value.trim()).toBe('info line');
    });

    it('retains footers', () => {
        textarea.value = '\n–\nfooter\n–\nother footer';
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');

        expect(textarea.value.trim()).toBe('info line\n–\nfooter\n–\nother footer');
    });
});


describe('adding footer', () => {
    it('adds the footer, prefixed with empty line', () => {
        const editNote = new EditNote('footer');
        editNote.addFooter();

        expect(textarea.value).toBe('\n–\nfooter');
    });

    it('retains previous content', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble';
        editNote.addFooter();

        expect(textarea.value).toBe('preamble\n–\nfooter');
    });

    it('deduplicates previous footer', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble\n–\nfooter';
        editNote.addFooter();

        expect(textarea.value).toBe('preamble\n–\nfooter');
    });

    it('retains other footers', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble\n–\nfooter2';
        editNote.addFooter();

        expect(textarea.value).toBe('preamble\n–\nfooter2\n–\nfooter');
    });

    it('deduplicates previous footer while retaining other footers', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble\n–\nfooter\n–\nfooter2';
        editNote.addFooter();

        expect(textarea.value).toBe('preamble\n–\nfooter2\n–\nfooter');
    });
});

describe('creating with footer from GM_info', () => {
    it('constructs an edit note with the footer', () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        GM.info.script = {
            name: 'userscript',
            version: '1.0.0',
            namespace: 'scriptnamespace',
        } as GM.ScriptInfo;

        const editNote = EditNote.withFooterFromGMInfo();
        editNote.addFooter();

        expect(textarea.value).toBe('\n–\nuserscript 1.0.0\nscriptnamespace');
    });
});
