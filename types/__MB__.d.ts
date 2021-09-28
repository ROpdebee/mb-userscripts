/**
 * Type declarations for the __MB__ global.
 */

interface __MB__ {
    $c: {
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

declare const __MB__: __MB__;

interface __CoverArt {
    validate_file(file: File): JQuery.Promise<string, string>
}

// Incomplete
interface MB {
    CoverArt: __CoverArt
}

declare const MB: MB;
