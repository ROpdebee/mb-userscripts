// Custom matchers for provider testing

import type { CoverArt } from '@src/mb_enhanced_cover_art_uploads/types';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';

export interface ExpectedCoverArt {
    urlPart: string | RegExp;
    types?: ArtworkTypeIDs[];
    comment?: string;
}

export function registerMatchers(): void {
    expect.extend({
        toMatchCoverArt(received: CoverArt, expected: ExpectedCoverArt): jest.CustomMatcherResult {
            const passPathname = expected.urlPart instanceof RegExp
                ? expected.urlPart.test(received.url.href)
                : received.url.href.includes(expected.urlPart);
            const passTypes = this.equals(received.types, expected.types);
            const passComment = received.comment === expected.comment;
            const pass = passPathname && passTypes && passComment;

            const notString = pass ? 'not ' : '';
            const messageLines: string[] = [];
            // Only set message if we expect it to pass and it doesn't, or when
            // we don't expect it to pass but it does.
            if (passPathname === this.isNot) {
                messageLines.push(
                    'Expected URL ' + notString + 'to ' + (expected.urlPart instanceof RegExp ? 'match' : 'include') + ':',
                    this.utils.printExpected(expected.urlPart),
                    'Received:',
                    this.utils.printReceived(received.url.href),
                    '',
                );
            }
            if (passTypes === this.isNot) {
                const expectedTypeStrings = expected.types?.map((type) => ArtworkTypeIDs[type]);
                const receivedTypeStrings = received.types?.map((type) => ArtworkTypeIDs[type]);
                messageLines.push(
                    'Expected types ' + notString + 'to strict equal:',
                    this.utils.printExpected(expectedTypeStrings),
                    'Received:',
                    this.utils.printReceived(receivedTypeStrings),
                    '',
                );
            }
            if (passComment === this.isNot) {
                if (expected.comment === undefined) {
                    messageLines.push('Expected comment ' + notString + 'to be undefined');
                } else {
                    messageLines.push(
                        'Expected comment ' + notString + 'to be:',
                        this.utils.printExpected(expected.comment),
                    );
                }
                messageLines.push(
                    'Received:',
                    this.utils.printReceived(received.comment),
                );
            }

            return {
                pass,
                message: (): string => {
                    const preamble = this.utils.matcherHint((this.isNot ? '.not' : '') + '.toMatchCoverArt') + '\n\n';
                    return preamble + messageLines.join('\n').trim();
                },
            };
        },
    });
}

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchCoverArt(expected: ExpectedCoverArt): R;
        }
    }
}
