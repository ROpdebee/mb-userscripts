// Incomplete type definitions for ws/ API advanced relationships
export interface AdvancedRelationship {
    ended: boolean;
}

export interface URLAdvancedRelationship extends AdvancedRelationship {
    url: {
        resource: string;
    };
}

export interface ReleaseAdvancedRelationship extends AdvancedRelationship {
    release: {
        id: string;
    };
}
