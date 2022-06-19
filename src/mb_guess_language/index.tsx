import pThrottle from 'p-throttle';

import type { ReleaseEditorMedium } from '@lib/MB/types';
import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';
import { LOGGER } from '@lib/logging/logger';
import { assertDefined } from '@lib/util/assert';
import { logFailure, retryTimes } from '@lib/util/async';
import { qs } from '@lib/util/dom';

import { detectLanguage } from './libretranslate';
import { detectScript } from './script';

import DEBUG_MODE from 'consts:debug-mode';
import USERSCRIPT_ID from 'consts:userscript-id';

async function expandMedium(medium: ReleaseEditorMedium): Promise<void> {
    // Already loaded.
    if (medium.loaded()) {
        return;
    }

    // Not yet loading: Release with > 3 mediums, expand them.
    if (!medium.loading()) {
        medium.loadTracks();
    }

    // Wait until medium has finished loading. Need to poll. Continuously poll
    // every 250ms, time out after 5s.
    return retryTimes((): void => {
        if (!medium.loaded()) throw new Error('Medium did not load');
    }, 20, 250);
}

async function _getTrackTitlesFromMedium(medium: ReleaseEditorMedium): Promise<string[]> {
    await expandMedium(medium);
    return medium.tracks().map((track) => track.name());
}

// Load at most 4 mediums each second.
const getTrackTitlesFromMedium = pThrottle({
    limit: 4,
    interval: 1000,
})(_getTrackTitlesFromMedium);

async function getTrackTitles(): Promise<string[]> {
    const mediums = window.MB.releaseEditor?.rootField.release().mediums() ?? [];

    const trackTitlesPerMedium = await Promise.all(mediums.map((medium) => getTrackTitlesFromMedium(medium)));
    const trackTitles = trackTitlesPerMedium.flat();

    if (trackTitles.length === 0) {
        throw new Error('No tracklist to guess from');
    }

    return trackTitles;
}

async function getTitles(): Promise<string[]> {
    const trackTitles = await getTrackTitles();

    const releaseTitle = window.MB.releaseEditor?.rootField.release().name();
    assertDefined(releaseTitle, 'Release title is undefined?');
    return [
        releaseTitle,
        ...trackTitles,
    ];
}

async function doGuess(): Promise<void> {
    const titles = await getTitles();

    try {
        await guessLanguage(titles);
    } catch (err) {
        LOGGER.error('Failed to guess language', err);
    }

    guessScript(titles);
}

function selectOption(element: HTMLSelectElement, label: string): void {
    const idx = [...element.options]
        .findIndex((option) => option.text.trim() === label);
    if (idx < 0) {
        throw new Error(`Label ${label} not found in selection dropdown list`);
    }

    element.selectedIndex = idx;
    element.dispatchEvent(new Event('change'));
}

async function guessLanguage(titles: string[]): Promise<void> {
    const text = titles.join('. ');
    const language = await detectLanguage(text);
    selectOption(qs<HTMLSelectElement>('select#language'), language);
}

function guessScript(titles: string[]): void {
    // Remove spaces, they're just filler and lead to poorer matches.
    const text = titles.join('').replaceAll(/\s+/g, '');
    const script = detectScript(text);
    if (!script) {
        LOGGER.error('Could not determine script');
        return;
    }

    selectOption(qs<HTMLSelectElement>('select#script'), script === 'Han' ? 'Han (Hanzi, Kanji, Hanja)' : script);
}

function addButton(): void {
    const btn = <button
        type='button'
        onClick={(evt): void => {
            evt.preventDefault();
            loadingSpan.style.display = '';
            btn.disabled = true;

            logFailure(
                doGuess()
                    .finally(() => {
                        loadingSpan.style.display = 'none';
                        btn.disabled = false;
                    }));
        }}
    >Guess language and script</button> as HTMLButtonElement;
    const loadingSpan = <span className='loading-message' style={{ display: 'none', marginLeft: '10px' }}/>;

    qs('table.row-form > tbody').append(<tr>
        <td />
        <td colSpan={2}>
            {btn}
            {loadingSpan}
        </td>
    </tr>);
}


LOGGER.configure({
    logLevel: DEBUG_MODE ? LogLevel.DEBUG : LogLevel.INFO,
});
LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));
addButton();
