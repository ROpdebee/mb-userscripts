import { LOGGER } from '@lib/logging/logger';

interface SuccessResult {
    language: LanguageCode;
    confidence: number;
}

interface ErrorResult {
    error: string;
}

type Result = SuccessResult[] | ErrorResult;

const LANGUAGE_MAPPINGS = {
    en: 'English',
    ar: 'Arabic',
    az: 'Azerbaijani',
    zh: 'Chinese',
    cs: 'Czech',
    da: 'Danish',
    nl: 'Dutch',
    eo: 'Esperanto',
    fi: 'Finnish',
    fr: 'French',
    de: 'German',
    el: 'Greek',
    he: 'Hebrew',
    hi: 'Hindi',
    hu: 'Hungarian',
    id: 'Indonesian',
    ga: 'Irish',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    fa: 'Persian',
    pl: 'Polish',
    pt: 'Portuguese',
    ru: 'Russian',
    sk: 'Slovak',
    es: 'Spanish',
    sv: 'Swedish',
    tr: 'Turkish',
    uk: 'Ukrainian',
    vi: 'Vietnamese',
};

type LanguageCode = keyof typeof LANGUAGE_MAPPINGS;

// In the order in which we'll try them.
// Generally: The ones with the least rate limited is tried first. It just so
// happens that those also support the least languages, so we try the ones with
// more rate limiting in case of failure.
const API_BASES = [
    'https://translate.argosopentech.com', // Seemingly unlimited, but limited language support
    // 'https://libretranslate.com',  // 30 per minute, larger language support, but we need an API key to access it.
    'https://libretranslate.de',  // 15 per minute, largest language support of all tested.
];

export async function detectLanguage(text: string, confidenceThreshold = 0.75): Promise<string> {
    for (const apiBase of API_BASES) {
        try {
            const result = await doRequest(apiBase, text);
            const reliableResult = result.find((res) => (res.confidence / 100) >= confidenceThreshold);
            if (reliableResult) {
                LOGGER.info(`Identified as ${reliableResult.language} with confidence ${reliableResult.confidence}%`);
                return LANGUAGE_MAPPINGS[reliableResult.language];
            }
            LOGGER.debug(JSON.stringify(result));
        } catch (err) {
            LOGGER.error(`Failed to detect language of text using ${apiBase}`, err);
        }
    }

    throw new Error('Could not detect language reliably');
}

async function doRequest(apiBase: string, text: string): Promise<SuccessResult[]> {
    const resp = await fetch(`${apiBase}/detect`, {
        method: 'post',
        headers: {
            accept: 'application/json',
        },
        body: new URLSearchParams({ q: text }),
    });

    const respContent = await resp.json() as Result;
    if ('error' in respContent) {
        throw new Error(respContent.error);
    }

    return respContent;
}
