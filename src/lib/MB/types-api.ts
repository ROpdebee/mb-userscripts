// Incomplete type definitions for ws/ API responses.
export interface AdvancedRelationship {
    ended: boolean;
}

export interface URLAdvRel extends AdvancedRelationship {
    url: {
        resource: string;
    };
}

export interface ReleaseAdvRel extends AdvancedRelationship {
    release: {
        id: string;
    };
}

// TODO: Refactor this so it's not a pyramid.
export interface Recording {
    id: string;
    title: string;
    releases: Array<{
        id: string;
        title: string;
        media: Array<{
            position: number;
            track: Array<{
                id: string;
                number: string;
                title: string;
                length: number;
            }>;
        }>;
    }>;
}

interface BaseAPIResponse {
    created: string;
    count: number;
    offset: number;
};

export type APIResponse<Key extends string, Value> = BaseAPIResponse & {
    [key in Key]: Value[];
};
