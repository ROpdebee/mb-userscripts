import { LOGGER } from '@lib/logging/logger';
import { formatPercentage } from '@lib/util/format';

// Only the ones that are "Frequently used" according to MB.
const REGEXES = {
    Arabic: /\p{Script=Arabic}/u,
    Cyrillic: /\p{Script=Cyrillic}/u,
    Greek: /\p{Script=Greek}/u,
    // We cannot distinguish between simplified and traditional. There are
    // implementations out there, but they list each of the traditional/simplified
    // characters, which is very bloated.
    Han: /\p{Script=Han}/u,
    Hebrew: /\p{Script=Hebrew}/u,
    // There's a separate script in MB for Katakana, but it's not always applicable.
    Japanese: /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    Korean: /[\p{Script=Han}\p{Script=Hangul}]/u,
    Thai: /\p{Script=Thai}/u,
    Latin: /\p{Script=Latin}/u,
};

type ScriptName = keyof typeof REGEXES;

function countMatchingCharacters(text: string, regexp: RegExp): number {
    return text.match(new RegExp(regexp, 'g'))?.length ?? 0;
}

function selectBestMatch(scriptToCount: Map<ScriptName, number>): [ScriptName, number] {
    const counts = [...scriptToCount.entries()].sort(([, c1], [, c2]) => c2 - c1);
    return counts[0];
}

export function detectScript(text: string, confidenceThreshold = 0.75): ScriptName | undefined {
    const scriptToCount = new Map(
        (Object.entries(REGEXES) as Array<[ScriptName, RegExp]>)
            .map(([script, regex]): [ScriptName, number] => [script, countMatchingCharacters(text, regex)]));

    // Save and remove Latin from the results, to prefer non-Latin over Latin
    // in mixed tracklists.
    const latinCount = scriptToCount.get('Latin')!;
    const latinConfidence = latinCount / text.length;
    scriptToCount.delete('Latin');

    // Prefer non-Latin if it makes up at least 15% of the text (arbitrary threshold)
    // and together with Latin leads to a good enough match.
    // See https://musicbrainz.org/doc/Style/Release#Language_and_script
    const bestMatch = selectBestMatch(scriptToCount);
    const bestMatchConfidence = bestMatch[1] / text.length;
    if (bestMatchConfidence >= 0.15 && bestMatchConfidence + latinConfidence >= confidenceThreshold) {
        LOGGER.info(`Identified as ${bestMatch[0]} with confidence ${formatPercentage(bestMatchConfidence + latinConfidence)}, of which ${formatPercentage(latinConfidence)} Latin`);
        return bestMatch[0];
    }

    if (latinConfidence > 0.75) {
        LOGGER.info(`Identified as Latin with confidence ${formatPercentage(latinConfidence)}`);
        return 'Latin';
    }

    return undefined;
}
