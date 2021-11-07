interface UserscriptCustomMetadata {
    name: string;
    description: string;
    match: readonly string[] | string;
    exclude?: readonly string[] | string;
    require?: readonly string[] | string;
    // https://wiki.greasespot.net/Metadata_Block#.40run-at
    'run-at'?: 'document-start' | 'document-end' | 'document-idle';
    grant?: readonly string[] | string;
    connect?: readonly string[] | string;
    resource?: readonly string[] | string;
}

export interface UserscriptDefaultMetadata {
    author: string;
    license?: string;
    namespace: string;
    homepageURL: string;
    supportURL: string;
    downloadURL: string;
    updateURL: string;
}

export type UserscriptMetadata = UserscriptCustomMetadata & Partial<UserscriptDefaultMetadata>;
export type AllUserscriptMetadata = UserscriptCustomMetadata & UserscriptDefaultMetadata;
