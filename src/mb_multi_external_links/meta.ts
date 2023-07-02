import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const mbMatchedUrls = [
    '*/edit',
    '*/edit?*',
    'release/*/edit-relationships*',
    '*/add',
    '*/add?*',
    '*/create',
    '*/create?*',
].map((path) => transformMBMatchURL(path));

const metadata: UserscriptMetadata = {
    name: 'MB: QoL: Paste multiple external links at once',
    description: 'Enables pasting multiple links, separated by whitespace, into the external link editor.',
    'run-at': 'document-end',
    match: [
        ...mbMatchedUrls,
        '*://atisket.pulsewidth.org.uk/*',
        '*://etc.marlonob.info/atisket/*',
    ],
    blurb: 'Paste multiple external links at once into the external link editor. Input is split on whitespace (newlines, tabs, spaces, etc.) and fed into the link editor separately. Additionally adds handy bulk Copy buttons to a-tisket release and artist URLs.',
};

export default metadata;
