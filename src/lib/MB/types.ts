// Incomplete

export interface ExternalLinksLink {
    rawUrl: string;
    url: string;
    submitted: boolean;
}

export interface ExternalLinks {
    handleUrlChange(linkIndexes: readonly number[], urlIndex: number, rawUrl: string): void;
    handleUrlBlur(index: number, isDuplicate: boolean, event: FocusEvent, urlIndex: number, canMerge: boolean): void;
    tableRef: {
        current: HTMLTableElement;
    };

    state: {
        links: ExternalLinksLink[];
    };
}

export interface ReleaseEditor {
    externalLinks: {
        externalLinksEditorRef: {
            current: ExternalLinks;
        };
    };
}

declare global {
    interface Window {
        MB: {
            releaseEditor?: ReleaseEditor;
            sourceExternalLinksEditor?: {
                externalLinksEditorRef: {
                    current: ExternalLinks;
                };
            };
        };
    }
}
