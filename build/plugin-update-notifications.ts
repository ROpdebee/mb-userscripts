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

        /**
         * Transform hook for the plugin.
         *
         * Injects the update notification helpers.
         *
         * @param      {string}                       code    The code
         * @param      {string}                       id      The identifier
         * @return     {Promise<undefined | string>}  The transformed result.
         */
        async transform(code: string, id: string): Promise<undefined | string> {
            if (!filter(id)) return;

            return [code, UPDATE_NOTIFICATION_CODE].join('\n\n');
        },
    };
}
