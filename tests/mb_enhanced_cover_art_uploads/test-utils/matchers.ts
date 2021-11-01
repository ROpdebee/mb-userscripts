// Custom matchers for provider testing

import type { CoverArt } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';

export interface ExpectedCoverArt {
    urlPart: string | RegExp;
    types?: ArtworkTypeIDs[];
    comment?: string;
}

export function registerMatchers(): void {
    expect.extend({
        toMatchCoverArt(received: CoverArt, expected: ExpectedCoverArt): jest.CustomMatcherResult {
            const passPathname = expected.urlPart instanceof RegExp
                ? expected.urlPart.test(received.url.pathname)
                : received.url.pathname.includes(expected.urlPart);
            const passTypes = this.equals(received.types, expected.types);
            const passComment = received.comment === expected.comment;
            const pass = passPathname && passTypes && passComment;

            const notString = pass ? 'not ' : '';
            const messageLines: string[] = [];
            // Only set message if we expect it to pass and it doesn't, or when
            // we don't expect it to pass but it does.
            if (passPathname === this.isNot) {
                messageLines.push('Expected URL path ' + notString + 'to ' + (expected.urlPart instanceof RegExp ? 'match' : 'include') + ':');
                messageLines.push(this.utils.printExpected(expected.urlPart));
                messageLines.push('Received:');
                messageLines.push(this.utils.printReceived(received.url.href));
                messageLines.push('');
            }
            if (passTypes === this.isNot) {
                const expectedTypeStrings = expected.types?.map((type) => ArtworkTypeIDs[type]);
                const receivedTypeStrings = received.types?.map((type) => ArtworkTypeIDs[type]);
                messageLines.push('Expected types ' + notString + 'to strict equal:');
                messageLines.push(this.utils.printExpected(expectedTypeStrings));
                messageLines.push('Received:');
                messageLines.push(this.utils.printReceived(receivedTypeStrings));
                messageLines.push('');
            }
            if (passComment === this.isNot) {
                if (typeof expected.comment === 'undefined') {
                    messageLines.push('Expected comment ' + notString + 'to be undefined');
                } else {
                    messageLines.push('Expected comment ' + notString + 'to be:');
                    messageLines.push(this.utils.printExpected(expected.comment));
                }
                messageLines.push('Received:');
                messageLines.push(this.utils.printReceived(received.comment));
            }

            return {
                pass,
                message: (): string => {
                    const preamble = this.utils.matcherHint((this.isNot ? '.not' : '') + '.toMatchCoverArt') + '\n\n';
                    return preamble + messageLines.join('\n').trim();
                }
            };
        }
    });
}

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchCoverArt(expected: ExpectedCoverArt): R;
        }
    }
}
