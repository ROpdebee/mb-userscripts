// Async XHR interfaces

// TODO: Look into using GM.* instead of GM_*, they're async

type LimitedGMXHROptions = Omit<GMXMLHttpRequestOptions, 'onload'|'onerror'|'onabort'|'ontimeout'|'onprogress'|'onreadystatechange'>;

interface GMXHROptions extends LimitedGMXHROptions {
    responseType?: XMLHttpRequestResponseType
}

interface GMXHRResponse extends GMXMLHttpRequestResponse {
    response: Blob
}

export async function gmxhr(options: GMXHROptions): Promise<GMXHRResponse> {
    return new Promise((resolve, reject_) => {
        const reject = (reason: string, error: any) => reject_({reason, error});
        GM_xmlhttpRequest({
            ...options,
            onload: (resp) => {
                if (resp.status >= 400) reject(`HTTP error ${resp.statusText}`, resp);
                else resolve(resp as GMXHRResponse);
            },
            onerror: (err) => reject('network error', err),
            onabort: (err) => reject('aborted', err),
            ontimeout: (err) => reject('timed out', err),
        });
    });
};
