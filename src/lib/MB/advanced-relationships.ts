// Incomplete type definitions for ws/ API advanced relationships
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
