import { AssertionError } from '@lib/util/assert';
import { onDocumentLoaded, onWindowLoaded, parseDOM, qs, qsa, qsMaybe, setInputValue } from '@lib/util/dom';

describe('qs', () => {
    it('selects from the document by default', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';

        expect(qs<HTMLInputElement>('span > input').value).toBe('test');
    });

    it('can select from other elements', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';
        const testElement = document.createElement('span');
        testElement.insertAdjacentHTML('beforeend', '<input type="text" value="other"/>');

        expect(qs<HTMLInputElement>('span > input', testElement).value).toBe('other');
    });

    it('throws if element does not exist', () => {
        document.body.innerHTML = '<span/>';

        expect(() => qs<HTMLInputElement>('span > input')).toThrow(AssertionError);
    });
});

describe('qsMaybe', () => {
    it('selects from the document by default', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';

        expect(qsMaybe<HTMLInputElement>('span > input')?.value).toBe('test');
    });

    it('can select from other elements', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';
        const testElement = document.createElement('span');
        testElement.insertAdjacentHTML('beforeend', '<input type="text" value="other"/>');

        expect(qsMaybe<HTMLInputElement>('span > input', testElement)?.value).toBe('other');
    });

    it('returns null if element does not exist', () => {
        document.body.innerHTML = '<span/>';

        expect(qsMaybe<HTMLInputElement>('span > input')).toBeNull();
    });
});

describe('qsa', () => {
    it('returns an array, not a nodelist', () => {
        document.body.innerHTML = '<span>Test</span>';

        expect(qsa<HTMLSpanElement>('span')).toBeArray();
        expect(qsa<HTMLSpanElement>('span')).not.toBeInstanceOf(NodeList);
    });

    it('selects from the document by default', () => {
        document.body.innerHTML = '<span class="test">Test</span><span class="test">Test 2</span><span>Test 3</span>';

        expect(qsa<HTMLSpanElement>('span.test')).toBeArrayOfSize(2);
    });

    it('can select from other elements', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';
        const testElement = document.createElement('span');
        testElement.insertAdjacentHTML('beforeend', '<span class="test">Test</span><span class="test">Test 2</span><span>Test 3</span>');

        expect(qsa<HTMLSpanElement>('span.test', testElement)).toBeArrayOfSize(2);
    });

    it('returns empty array if element does not exist', () => {
        document.body.innerHTML = '<span/>';

        expect(qsa<HTMLInputElement>('span > input')).toBeArrayOfSize(0);
    });
});

describe('parsing DOM', () => {
    it('returns a document on success', () => {
        expect(parseDOM('<html><head/><body><h1>Hello world</h1></body></html>', 'https://example.com/')).toBeInstanceOf(Document);
    });

    it('sets the base URL correctly', () => {
        const dom = parseDOM('<html><head/><body><a href="/test"/></body></html>', 'https://example.com/');

        expect(dom.querySelector<HTMLAnchorElement>('a')?.href).toBe('https://example.com/test');
    });

    it('retains original base URL', () => {
        const dom = parseDOM('<html><head><base href="https://musicbrainz.org/"></head><body><a href="/test"/></body></html>', 'https://example.com/');

        expect(dom.querySelector<HTMLAnchorElement>('a')?.href).toBe('https://musicbrainz.org/test');
    });

    // Can't really test error cases because DOMParser never errors on text/html.
});

describe('callback on document loaded', () => {
    it('does not fire if the document is not loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
        const cb = jest.fn();
        onDocumentLoaded(cb);

        expect(cb).not.toHaveBeenCalled();
    });

    it('fires if the document was already loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
        const cb = jest.fn();
        onDocumentLoaded(cb);

        expect(cb).toHaveBeenCalledOnce();
    });

    it('fires after the document was loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
        const cb = jest.fn();
        onDocumentLoaded(cb);

        expect(cb).not.toHaveBeenCalled();

        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(cb).toHaveBeenCalledOnce();
    });
});

describe('callback on window loaded', () => {
    const cb = jest.fn();

    afterEach(() => {
        cb.mockReset();
    });

    it('does not fire if the window is not loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('interactive');
        const cb = jest.fn();
        onWindowLoaded(cb);

        expect(cb).not.toHaveBeenCalled();
    });

    it('fires if the window was already loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
        const cb = jest.fn();
        onWindowLoaded(cb);

        expect(cb).toHaveBeenCalledOnce();
    });

    it('fires after the window was loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('interactive');
        const cb = jest.fn();
        onWindowLoaded(cb);

        expect(cb).not.toHaveBeenCalled();

        window.dispatchEvent(new Event('load'));

        expect(cb).toHaveBeenCalledOnce();
    });
});

describe('setting input value', () => {
    // These tests are a bit dumb, and this should really be E2E tested instead.
    // The whole purpose of this function is to test setting values of inputs
    // controlled by React, but React is of course not running in the test session.
    const domContent = '<html><body><input type="value" /></body></html>';

    it('sets input value', () => {
        const dom = parseDOM(domContent, 'https://example.com');
        const input = qs<HTMLInputElement>('input', dom);
        setInputValue(input, 'test123');

        expect(input.value).toBe('test123');
    });

    it('dispatches event if wanted', () => {
        const dom = parseDOM(domContent, 'https://example.com');
        const input = qs<HTMLInputElement>('input', dom);
        const handler = jest.fn();
        input.addEventListener('input', handler);
        setInputValue(input, 'test123', true);

        expect(handler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
            target: input,
        }));
    });

    it('does not dispatch event if unwanted', () => {
        const dom = parseDOM(domContent, 'https://example.com');
        const input = qs<HTMLInputElement>('input', dom);
        const handler = jest.fn();
        input.addEventListener('input', handler);
        setInputValue(input, 'test123', false);

        expect(handler).not.toHaveBeenCalled();
    });
});
