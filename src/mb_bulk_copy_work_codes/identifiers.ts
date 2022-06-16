interface AgencyRule {
    /**
     * A RegExp applied on the input to validate the input. ^ and $ will
     * automatically be inserted at the start and end of the regexp,
     * respectively.
     */
    inRegexp: RegExp;
    /**
     * A string applied to transform the input to a formatted output. Captured
     * groups of the input RegExp will be available here, the same format can
     * be used as String.replace. If empty or undefined, defaults to the
     * portion of the string that is matched by the inRegexp. Can also be a
     * function.
     */
    outFormat?: string | ((substring: string, ...args: string[]) => string);
    /**
     * Boolean flag, optional, by default false. If true, leading zeroes will
     * not be trimmed from the input before feeding into the input regexp.
     */
    keepLeadingZeroes?: boolean;
    /**
     * Integer, pads the input to the given length at the start with the given
     * padCharacter if the input is not of that length.
     */
    ensureLength?: number;
    /**
     * 1 character string, used to pad to the ensured length.
     */
    padCharacter?: string;
    /**
     * Additional info to show when validation/formatting fails.
     */
    message?: string;
}

interface ValidationResultValid {
    isValid: true;
    input: string;
    formattedCode: string;
    wasChanged: boolean;
}

interface ValidationResultInvalid {
    isValid: false;
    input: string;
    message?: string;
}

export type ValidationResult = ValidationResultValid | ValidationResultInvalid;

/**
* API for work identifiers. See inline docs.
*/
export const VERSION = '2021.5.27';  // Just for use in edit notes, really.

/**
 * Helper for LatinNet agencies. Returns a validation/formatting ruleset which
 * removes the CISAC agency number suffix.
 *
 * @param      {string}         agencyId  The agency identifier name.
 * @return     {AgencyRule}  Ruleset to validate and format the LatinNet
 *                              agency.
 */
function latinNetID(agencyId: string): AgencyRule {
    return {
        inRegexp: new RegExp(`(\\d{0,7})(?:${agencyId})?`),
        outFormat: '$1',
        keepLeadingZeroes: false,
    };
}

const CODE_FORMATS: Record<string, AgencyRule | [AgencyRule, ...AgencyRule[]] | undefined> = {
    'AACIMH ID': {
        inRegexp: /\d{0,7}/,
    },
    'ACAM ID': latinNetID('107'),
    'ACDAM ID': latinNetID('103'),
    'AEI ID': latinNetID('250'),
    'AGADU ID': latinNetID('004'),
    'AKKA/LAA ID': [{
        inRegexp: /\d{0,8}/,
    }, {
        inRegexp: /\d{5}M/,
        keepLeadingZeroes: true,
    }],
    'AKM ID': {
        // FIXME: This cannot distinguish between bare work codes and work codes with revision numbers.
        // E.g. 649501
        inRegexp: /\d{0,8}(?:-?\d{2})?/,
    },
    'AMRA ID': {
        inRegexp: /AWK\d{0,7}/,
    },
    'APA ID': latinNetID('015'),
    'APDAYC ID': [
        latinNetID('007'),
        {
            inRegexp: /\d{8}/,
        }],
    'APRA ID': {
        inRegexp: /(?:GW|BG|JG|PM)\d{8}/,
    },
    'ARTISJUS ID': {
        inRegexp: /4\d{9}/,
    },
    'ASCAP ID': {
        inRegexp: /\d{0,14}/,
    },
    'BMI ID': {
        inRegexp: /\d{0,8}/,
    },
    'BUMA/STEMRA ID': {
        inRegexp: /W-\d{9}/,
    },
    'CASH ID': {
        inRegexp: /[CMPU]-\d{10}/,
    },
    'CCLI ID': {
        inRegexp: /\d{0,7}/,
    },
    'COMPASS ID': {
        inRegexp: /\d{0,8}/,
    },
    'COTT ID': {
        inRegexp: /\d{0,7}/,
    },
    'ECAD ID': {
        inRegexp: /\d{0,8}/,
    },
    'GEMA ID': {
        inRegexp: /(\d{0,8})[-‐](\d{3})/,
        outFormat: '$1-$2',
    },
    'HFA ID': {
        inRegexp: /[A-Z\d]{6}/,
    },
    'ICE ID': {
        inRegexp: /\d{0,8}/,
    },
    'IMRO ID': {
        inRegexp: /R\d{0,8}/,
    },
    'JASRAC ID': {
        inRegexp: /(\d[\dA-Z]\d)-?(\d{4})-?(\d)/,
        outFormat: '$1-$2-$3',
        keepLeadingZeroes: true,
    },
    'KODA ID': {
        inRegexp: /\d{0,8}/,
    },
    'KOMCA ID': [{
        inRegexp: /\d{12}/,
    }, {
        inRegexp: /0000M\d{5,7}/,
        keepLeadingZeroes: true,
    }],
    'LatinNet ID': {
        inRegexp: /\d{3,4}/,
    },
    'MACP ID': {
        inRegexp: /1\d{9}/,
    },
    'MÜST ID': {
        inRegexp: /1\d{9}/,
    },
    'NexTone ID': {
        inRegexp: /N\d{8}/,
    },
    'NICAUTOR ID': {
        inRegexp: /\d{0,7}/,
    },
    'OSA ID': {
        inRegexp: /(I\d{3})\.?(\d{2})\.?(\d{2})\.?(\d{2})/,
        outFormat: '$1.$2.$3.$4',
    },
    'PRS tune code': {
        inRegexp: /\d{4,6}[\dA-Z][A-Z]/,
    },
    'SABAM ID': {
        inRegexp: /[A-Z\d]{7}\d{2}/,
        ensureLength: 9,
        padCharacter: '0',
        message: 'SABAM uses zero-padding in its own repertory.',
    },
    'SACEM ID': {
        inRegexp: /(\d{2})\s?(\d{3})\s?(\d{3})\s?(\d{2})/,
        outFormat: '$1 $2 $3 $4',
    },
    'SACM ID': {
        // NOTE: Keeping all leading zeroes here, because without the leading
        // zeroes, their own repertory search doesn't find the work.
        inRegexp: /[\dA-Z]\d{8}/,
        ensureLength: 9,
        padCharacter: '0',
        message: 'SACM IDs are required to be zero-padded until 9 characters.',
    },
    'SACIM ID': {
        inRegexp: /\d{0,7}/,
    },
    'SACVEN ID': latinNetID('060'),
    'SADAIC ID': latinNetID('061'),
    'SAYCE ID': {
        inRegexp: /(\d{0,8})(?:065)?/,
        outFormat: '$1',
    },
    'SAYCO ID': {
        inRegexp: /(\d{0,8})(?:084)?/,
        outFormat: '$1',
    },
    'SESAC ID': {
        inRegexp: /\d{0,9}/,
    },
    'SGACEDOM ID': {
        inRegexp: /\d{0,7}/,
    },
    'SGAE ID': {
        inRegexp: /(\d{1,3})(?:\.?(\d{3}))?(?:\.?(\d{3}))?/,
        outFormat: (_substring, p1, p2, p3): string => [p1, p2, p3].filter(Boolean).join('.'),
    },
    'SIAE ID': {
        inRegexp: /\d{7,9}0\d/,
    },
    'SOBODAYCOM ID': {
        inRegexp: /\d{0,7}/,
    },
    'SOCAN ID': {
        inRegexp: /2?\d{8}/,
    },
    'SODRAC ID': {
        inRegexp: /\d{0,7}/,
    },
    'SPA ID': {
        inRegexp: /\d{0,7}/,
    },
    'SPAC ID': {
        inRegexp: /\d{0,7}/,
    },
    'STEF ID': {
        inRegexp: /\d{0,8}/,
    },
    'STIM ID': {
        inRegexp: /\d{0,8}/,
    },
    'SUISA ID': {
        inRegexp: /(\d{6})\s?(\d{3})\s?(\d{2})/,
        outFormat: '$1 $2 $3',
        ensureLength: 13,  // Account for possible spaces too
        padCharacter: '0',  // Extraneous spaces inserted here will be removed
    },
    'TEOSTO ID': {
        inRegexp: /\d{8,9}/,
    },
    'TONO ID': {
        inRegexp: /\d{0,8}/,
    },
    'ZAiKS ID': {
        inRegexp: /\d{0,7}/,
    },
};

/**
 * Prepend and append new content to an existing regular expression.
 *
 * @param      {string}  start   Part to prepend.
 * @param      {RegExp}  regexp  The regular expression
 * @param      {string}  end     Part to append.
 * @return     {RegExp}  Resulting regular expression.
 */
function wrapRegex(start: string, regexp: RegExp, end: string): RegExp {
    return new RegExp(start + regexp.source + end);
}

/**
 * Validate and optionally format an agency code.
 *
 * @param      {string}  code      The code
 * @param      {string}  agencyId  The agency identifier
 * @return     {Object}  The result of the validation/formatting. Contains
 *                       keys isValid (Boolean), indicating whether the
 *                       code is valid, and input (String), the input code.
 *                       If the code was valid, formattedCode will contain
 *                       the result of formatting the code, and wasChanged
 *                       is a Boolean indicating whether formatting
 *                       actually changed the code.
 */
export function validateCode(code: string, agencyId: string): ValidationResult {
    const rules = CODE_FORMATS[agencyId];
    if (!rules) {
        // We don't have a validator for this agency, assume it's valid.
        return {
            isValid: true,
            input: code,
            formattedCode: code,
            wasChanged: false,
        };
    }

    if (Array.isArray(rules)) {
        let partialResult: ValidationResult | undefined;
        for (const rule of rules) {
            partialResult = validateCodeSingleRule(code, rule);
            if (partialResult.isValid) {
                break;
            }
        }

        // Typescript doesn't recognise that the loop above is executed at least
        // once.
        return partialResult!;
    }
    return validateCodeSingleRule(code, rules);
}

/**
 * Validate and optionally format an agency code, given a single rule.
 *
 * @param      {string}  code    The code
 * @param      {Object}  rule    The rule
 * @return     {Object}  Identical to return type of validateCode.
 */
function validateCodeSingleRule(code: string, rule: AgencyRule): ValidationResult {
    let inputRegexp = rule.inRegexp;
    let outFormat = rule.outFormat;
    if (!outFormat) {
        // Insert a capture group
        inputRegexp = wrapRegex('(', inputRegexp, ')');
        outFormat = '$1';
    } else {
        inputRegexp = wrapRegex('(?:', inputRegexp, ')');
    }

    if (!rule.keepLeadingZeroes) {
        inputRegexp = wrapRegex('0*', inputRegexp, '');
    }

    inputRegexp = wrapRegex('^', inputRegexp, '$');

    if (rule.ensureLength && rule.padCharacter) {
        code = code.padStart(rule.ensureLength, rule.padCharacter);
    }

    if (!inputRegexp.test(code)) {
        return {
            isValid: false,
            input: code,
            message: rule.message,
        };
    }

    // Try formatting
    // @ts-expect-error TS bug?
    let formatted = code.replace(inputRegexp, outFormat);

    if (!formatted) {
        console.error(`Failed to format ${code}`);
        formatted = code;
    }

    return {
        isValid: true,
        input: code,
        formattedCode: formatted,
        wasChanged: formatted !== code,
    };
}

/**
 * Agencies whose MB identifier key isn't just `<agency name> ID`.
 * Maps the ISWCNet agency name to the MB key.
 */
const agencyKeyTransformations: Record<string, string | undefined> = {
    'BUMA': 'BUMA/STEMRA ID',
    'MUST': 'MÜST ID',
    'PRS': 'PRS tune code',
    'SESAC Inc.': 'SESAC ID',
    'ZAIKS': 'ZAiKS ID',
};

/**
 * Convert an input agency name to the MB identifier key.
 *
 * @param      {string}  agencyName  The agency name
 * @return     {string}  The MB identifier key.
 */
export function agencyNameToID(agencyName: string): string {
    return agencyKeyTransformations[agencyName] ?? (agencyName + ' ID');
}
