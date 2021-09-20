/**
 * Type declarations for the __MB__ global.
 */

interface __MB__ {
    DBDefs: {
        test: any
    }
    $c: {
        action: object
        req: object
        stash: object
        user: {
            name: string
            entityType: 'editor'
            gravatar: string
            id: number
            has_confirmed_email_address: boolean
            privileges: number
            preferences: {
                datetime_format: string
                timezone: string
            }
        }
    }
}

declare var __MB__: __MB__;

interface CoverArt {
    validate_file(file: File): JQuery.Promise<string, string>;
}

// Incomplete
interface MB {
    CoverArt: CoverArt
}

declare var MB: MB;
