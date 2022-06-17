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

interface BaseArea {
    containment: Area[];
    primary_code: string | null;
    name: string;
}

export interface AreaCountry extends BaseArea {
    typeID: 1;
    country_code: string;
    primary_code: string;
}

export interface AreaSubdivision extends BaseArea  {
    typeID: 2;
    country_code: 0;
}

export interface AreaCity extends BaseArea {
    typeID: 3;
    country_code: 0;
}

export interface AreaMunicipality extends BaseArea {
    typeID: 4;
    country_code: 0;
}

export type Area = AreaCountry | AreaSubdivision | AreaCity | AreaMunicipality;

export interface Place {
    name: string;
    area: Area;
}

export interface RelationshipDate {
    day?: number | null;
    month?: number | null;
    year?: number | null;
}

interface BaseRecordingRelationship {
    linkTypeID: number;
    attributes?: Array<{
        typeID: number;
    }>;
    entity0_credit: string;

    begin_date: RelationshipDate | null;
    end_date: RelationshipDate | null;
}

interface RecordingRelationshipWithTarget<LinkTypeID extends number, TargetT> extends BaseRecordingRelationship {
    linkTypeID: LinkTypeID;
    target: TargetT;
}

type RecordingRelationship =
    RecordingRelationshipWithTarget<278, unknown /* work */>
    | RecordingRelationshipWithTarget<693, Place>
    | RecordingRelationshipWithTarget<698, Area>
    | BaseRecordingRelationship;

export interface ReleaseRecordingRels {
    id: string;
    mediums: Array<{
        position: number;
        tracks: Array<{
            gid: string;
            number: string;
            recording: {
                comment: string;
                relationships: RecordingRelationship[];
            };
        }>;
    }>;

    releaseGroup: {
        secondaryTypeIDs?: number[];
    };
}

export interface Release {
    id: string;
    packagingID: number;
    statusID: number;
    combined_format_name?: string;
    barcode?: string;
    events?: Array<{
        country?: { primary_code: string };
        date?: RelationshipDate;
    }>;
    labels?: Array<{
        catalogNumber?: string;
        label?: {
            gid: string;
            name: string;
        };
    }>;
    mediums: Array<{
        format?: {
            name: string;
        };
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
