// istanbul ignore file: Better suited for E2E test.

import * as pages from './pages';


function onReleasePage(): boolean {
    return document.location.pathname.startsWith('/release/');
}

function onMainReleasePage(): boolean {
    return onReleasePage() && document.location.pathname.split('/').length === 3;
}

function onReleaseEditor(): boolean {
    return onReleasePage() && document.location.pathname.split('/').length === 4 && document.location.pathname.endsWith('/edit');
}


if (onMainReleasePage()) {
    pages.main.addLinks();
} else if (onReleaseEditor()) {
    pages.edit.addLinks();
}
