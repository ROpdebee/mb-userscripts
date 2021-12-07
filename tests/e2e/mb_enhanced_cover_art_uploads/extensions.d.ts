/// <references types="codeceptjs" />
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AddCoverArtPageType = import('./AddCoverArtPage').AddCoverArtPageType;

declare namespace CodeceptJS {
    interface SupportObject {
        AddCoverArtPage: AddCoverArtPageType;
    }
}
