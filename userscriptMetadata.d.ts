interface UserscriptCustomMetadata {
    name: string
    description: string
    version: string
    match: string[]
    exclude?: string[]
    require?: string[]
    'run-at'?: string[]
    grant?: string[]
    connect?: string[]
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
