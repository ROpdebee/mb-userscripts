interface UserscriptCustomMetadata {
    name: string;
    description: string;
    match: readonly string[] | string;
    exclude?: readonly string[] | string;
    require?: readonly string[] | string;
    'run-at'?: string;
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
