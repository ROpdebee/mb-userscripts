import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';

interface PluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
}

const UPDATE_NOTIFICATION_CODE = `
import { maybeDisplayNewFeatures } from '@lib/update-notifications';
import { onDocumentLoaded } from '@lib/util/dom';

if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    onDocumentLoaded(maybeDisplayNewFeatures);
}`;

export const UPDATE_NOTIFICATIONS_SOURCE_ID = '_UpdateNotifications_virtualSource_';

/**
 * Transformer plugin to automatically inject the update notifications.
 *
 * @param      {Readonly<PluginOptions>}  options  The options
 * @return     {Plugin}  The plugin.
 */
export function updateNotifications(options?: Readonly<PluginOptions>): Plugin {
    const { include, exclude } = options ?? {};
    const filter = createFilter(include, exclude);

    return {
        name: 'UpdateNotificationsPlugin',

        resolveId(id): { id: string; moduleSideEffects: boolean } | null {
            if (id === UPDATE_NOTIFICATIONS_SOURCE_ID) {
                return {
                    id: UPDATE_NOTIFICATIONS_SOURCE_ID,
                    moduleSideEffects: true,
                };
            }
            return null;
        },

        load(id): string | undefined {
            if (id === UPDATE_NOTIFICATIONS_SOURCE_ID) return UPDATE_NOTIFICATION_CODE;
            return undefined;
        },

        /**
         * Transform hook for the plugin.
         *
         * Injects the update notification helpers.
         *
         * @param      {string}              code    The code
         * @param      {string}              id      The identifier
         * @return     {string | undefined}  The transformed result.
         */
        transform(code: string, id: string): string | undefined {
            if (!filter(id)) return;

            return [code, `import "${UPDATE_NOTIFICATIONS_SOURCE_ID}";`].join('\n\n');
        },
    };
}
