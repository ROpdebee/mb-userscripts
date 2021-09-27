import { EditNote } from '@lib/util/editNotes';

let textarea: HTMLTextAreaElement;

beforeEach(() => {
    document.body.innerHTML = '<textarea class="edit-note" />';
    textarea = document.body.querySelector<HTMLTextAreaElement>('textarea')!;
});

describe('adding extra info', () => {
    it('adds the info line', () => {
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');
        expect(textarea.value.trim()).toStrictEqual('info line');
    });

    it('retains previous content', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble';
        editNote.addExtraInfo('info line');
        expect(textarea.value).toStrictEqual('preamble\ninfo line');
    });

    it('filters out duplicate lines', () => {
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');
        editNote.addExtraInfo('info line');
        expect(textarea.value.trim()).toStrictEqual('info line');
    });

    it('retains different lines', () => {
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');
        editNote.addExtraInfo('info line 2');
        expect(textarea.value.trim()).toStrictEqual('info line\ninfo line 2');
    });

    it('filters out pre-existing duplicates', () => {
        textarea.value = 'info line';
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');
        expect(textarea.value.trim()).toStrictEqual('info line');
    });

    it('retains pre-existing lines', () => {
        textarea.value = 'preamble';
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');
        expect(textarea.value.trim()).toStrictEqual('preamble\ninfo line');
    });

    it('retains footers', () => {
        textarea.value = '\n–\nfooter\n–\nother footer';
        const editNote = new EditNote('footer');
        editNote.addExtraInfo('info line');
        expect(textarea.value.trim()).toStrictEqual('info line\n–\nfooter\n–\nother footer');
    });
});


describe('adding footer', () => {
    it('adds the footer', () => {
        const editNote = new EditNote('footer');
        editNote.addFooter();
        expect(textarea.value).toStrictEqual('\n–\nfooter');
    });

    it('retains previous content', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble';
        editNote.addFooter();
        expect(textarea.value).toStrictEqual('preamble\n–\nfooter');
    });

    it('deduplicates previous footer', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble\n–\nfooter';
        editNote.addFooter();
        expect(textarea.value).toStrictEqual('preamble\n–\nfooter');
    });

    it('retains other footers', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble\n–\nfooter2';
        editNote.addFooter();
        expect(textarea.value).toStrictEqual('preamble\n–\nfooter2\n–\nfooter');
    });

    it('deduplicates previous footer while retaining other footers', () => {
        const editNote = new EditNote('footer');
        textarea.value = 'preamble\n–\nfooter\n–\nfooter2';
        editNote.addFooter();
        expect(textarea.value).toStrictEqual('preamble\n–\nfooter2\n–\nfooter');
    });
});

describe('creating with footer from GM_info', () => {
    it('constructs an edit note with the footer', () => {
        const mockedGMInfo = {
            script: {
                name: 'userscript',
                version: '1.0.0',
                namespace: 'scriptnamespace',
            },
        } as typeof GM_info;
        global.GM_info = mockedGMInfo;

        const editNote = EditNote.withFooterFromGMInfo();
        editNote.addFooter();

        expect(textarea.value).toStrictEqual('\n–\nuserscript 1.0.0\nscriptnamespace');
    });
});
