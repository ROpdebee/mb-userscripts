import { QobuzProvider } from './qobuz';

// Qub Musique uses Qobuz as a backend and reuses the same IDs and covers. See
// https://github.com/ROpdebee/mb-userscripts/issues/158
export class QubMusiqueProvider extends QobuzProvider {
    public override readonly supportedDomains = ['qub.ca'];
    public override readonly favicon = 'https://www.qub.ca/assets/favicons/apple-touch-icon.png';
    public override readonly name = 'QUB Musique';
    // Include musique in the regex as it seems QUB does much more than just
    // music streaming
    protected override readonly urlRegex = [/musique\/album\/[\w-]*-([A-Za-z\d]+)(?:\/|$)/];
    // We can reuse the rest of the implementations of QobuzProvider, since it
    // extracts the ID and uses the Qobuz API instead of loading the page.
}
