import { AssertionError } from "@lib/util/assert";
import { onDocumentLoaded, parseDOM, qs, qsa, qsMaybe } from "@lib/util/dom";

describe('qs', () => {
    it('selects from the document by default', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';
        expect(qs<HTMLInputElement>('span > input').value).toStrictEqual('test');
    });

    it('can select from other elements', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';
        const testElement = document.createElement('span');
        testElement.insertAdjacentHTML('beforeend', '<input type="text" value="other"/>');
        expect(qs<HTMLInputElement>('span > input', testElement).value).toStrictEqual('other');
    });

    it('throws if element does not exist', () => {
        document.body.innerHTML = '<span/>';
        expect(() => qs<HTMLInputElement>('span > input')).toThrow(AssertionError);
    });
});

describe('qsMaybe', () => {
    it('selects from the document by default', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';
        expect(qsMaybe<HTMLInputElement>('span > input')?.value).toStrictEqual('test');
    });

    it('can select from other elements', () => {
        document.body.innerHTML = '<span><input type="text" value="test"/></span>';
        const testElement = document.createElement('span');
        testElement.insertAdjacentHTML('beforeend', '<input type="text" value="other"/>');
        expect(qsMaybe<HTMLInputElement>('span > input', testElement)?.value).toStrictEqual('other');
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
        expect(parseDOM('<html><head/><body><h1>Hello world</h1></body></html>')).toBeInstanceOf(Document);
    });

    // Can't really test error cases because DOMParser never errors on text/html.
});

describe('callback on document loaded', () => {
    it('does not fire if the document is not loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
        const cb = jest.fn();
        onDocumentLoaded(cb);
        expect(cb).not.toBeCalled();
    });

    it('fires if the document was already loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
        const cb = jest.fn();
        onDocumentLoaded(cb);
        expect(cb).toBeCalledTimes(1);
    });

    it('fires after the document was loaded', () => {
        jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
        const cb = jest.fn();
        onDocumentLoaded(cb);
        expect(cb).not.toBeCalled();
        document.dispatchEvent(new Event('DOMContentLoaded'));
        expect(cb).toBeCalledTimes(1);
    });
});
