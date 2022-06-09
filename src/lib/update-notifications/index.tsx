// istanbul ignore file: Covered by E2E

import { qs, qsMaybe } from '@lib/util/dom';
import { parseVersion, versionLessThan } from '@lib/util/versions';

import CHANGELOG_URL from 'consts:changelog-url';
import USERSCRIPT_FEATURE_HISTORY from 'consts:userscript-feature-history';
import USERSCRIPT_ID from 'consts:userscript-id';
import bannerStyle from './banner.scss';

const LAST_DISPLAYED_KEY = `ROpdebee_${USERSCRIPT_ID}_last_notified_update`;

export function maybeDisplayNewFeatures(): void {
    const lastDisplayedVersionString = localStorage.getItem(LAST_DISPLAYED_KEY);
    // eslint-disable-next-line no-restricted-globals
    const scriptInfo = GM.info.script;

    // If we've never shown a notification before, don't show one. Otherwise
    // a couple of years down the line, someone might get spammed with a huge
    // banner if we've made many updates.
    if (!lastDisplayedVersionString) {
        // Set the userscript version so that the next update will be displayed.
        localStorage.setItem(LAST_DISPLAYED_KEY, scriptInfo.version);
        return;
    }

    const lastDisplayedVersion = parseVersion(lastDisplayedVersionString);
    const newFeatures = USERSCRIPT_FEATURE_HISTORY
        .filter((feat) => versionLessThan(lastDisplayedVersion, parseVersion(feat.versionAdded)));

    // Don't show a notification when there are no new features
    if (!newFeatures.length) return;

    showFeatureNotification(scriptInfo.name, scriptInfo.version, newFeatures.map((feat) => feat.description));
}


function insertStyle(): void {
    const STYLE_ID = 'ROpdebee_Update_Banner';

    // Skip if already inserted by other script
    if (qsMaybe(`style#${STYLE_ID}`) !== null) return;

    const style = <style id={STYLE_ID}>{bannerStyle}</style>;
    document.head.insertAdjacentElement('beforeend', style);
}

function showFeatureNotification(scriptName: string, newVersion: string, newFeatures: string[]): void {
    insertStyle();

    const banner = <div className={'banner warning-header'}>
        <p>
            {`${scriptName} was updated to v${newVersion}! `}
            <a href={CHANGELOG_URL}>See full changelog here</a>
            {'. New features since last update:'}
        </p>
        <div className={'ROpdebee_feature_list'}>
            <ul>
                {newFeatures.map((feat) => <li>{feat}</li>)}
            </ul>
        </div>
        <button
            className='dismiss-banner remove-item icon'
            data-banner-name='alert'
            type='button'
            onClick={(): void => {
                banner.remove();
                // eslint-disable-next-line no-restricted-globals
                localStorage.setItem(LAST_DISPLAYED_KEY, GM.info.script.version);
            }}
        />
    </div>;

    qs('#page').insertAdjacentElement('beforebegin', banner);
}
