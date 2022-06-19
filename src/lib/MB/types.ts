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

export interface ReleaseEditorMedium {
    loaded(): boolean;
    loading(): boolean;
    loadTracks(): void;
    tracks(): Array<{
        name(): string;
    }>;
}

export interface ReleaseEditorFields {
    release(): {
        name(): string;
        mediums(): ReleaseEditorMedium[];
    };
}

export interface ReleaseEditor {
    externalLinks: {
        current: ExternalLinks;
    };
    rootField: ReleaseEditorFields;
}

declare global {
    interface Window {
        MB: {
            releaseEditor?: ReleaseEditor;
            sourceExternalLinksEditor?: {
                current: ExternalLinks;
            };
        };
    }
}
