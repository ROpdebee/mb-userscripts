// Incomplete type definitions for ws/ API advanced relationships
export interface AdvancedRelationship {
    ended: boolean;
}

export interface URLAdvRel extends AdvancedRelationship {
    url: {
        resource: string;
    };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReleaseAdvRel extends AdvancedRelationship {}
