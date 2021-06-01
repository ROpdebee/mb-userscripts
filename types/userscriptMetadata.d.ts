interface UserscriptCustomMetadata {
    name: string
    description: string
    version: string
    match: readonly string[]
    exclude?: readonly string[]
    require?: readonly string[]
    'run-at'?: string
    grant?: readonly string[]
    connect?: readonly string[]
}

export interface UserscriptDefaultMetadata {
    author: string
    license?: string
    namespace: string
    homepageURL: string
    supportURL: string
    downloadURL: string
    updateURL: string
}

export type UserscriptMetadata = UserscriptCustomMetadata & Partial<UserscriptDefaultMetadata>;
export type AllUserscriptMetadata = UserscriptCustomMetadata & UserscriptDefaultMetadata;
