import type Moment from 'moment';

import type { RelationshipDate, Release } from '@lib/MB/types-api';
import type { ROpdebee_getImageDimensions } from '@src/mb_caa_dimensions/exports';
import type { CAAIndex } from '@src/mb_enhanced_cover_art_uploads/providers/archive';
import { insertBetween } from '@lib/util/array';
import { logFailure } from '@lib/util/async';

import { fixCaaUrl, getDimensionsWhenInView, openComparisonDialog, selectImage } from './comparisonDialog';
import { LIKELY_DIGITAL_DIMENSIONS, MB_FORMAT_TRANSLATIONS, NONSQUARE_PACKAGING_COVER_TYPES, NONSQUARE_PACKAGING_TYPES, PACKAGING_TYPES, SHADY_REASONS, STATUSES } from './constants';

export type CAAImage = CAAIndex['images'][0];

const getImageDimensions = ((): ROpdebee_getImageDimensions => {
    const actualFn = window.ROpdebee_getImageDimensions;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!actualFn) {
        // Don't warn here, if we can't find this function, we likely won't have
        // found the other either
        return () => Promise.reject('Script unavailable');
    }

    return actualFn;
})();

// FIXME: This is duplicated in another script
function stringifyDate(date: RelationshipDate): string {
    const year = date.year ? date.year.toString().padStart(4, '0') : '????';
    const month = date.month ? date.month.toString().padStart(2, '0') : '??';
    const day = date.day ? date.day.toString().padStart(2, '0') : '??';
    return [year, month, day].join('-')
        .replace(/(?:-\?{2}){1,2}$/, ''); // Remove -?? or -??-?? suffix.
    // If neither year, month, or day is set, will return '????'
}

function translateMBDateFormatToMoments(dateFormat: string): string {
    // eslint-disable-next-line unicorn/no-array-reduce
    return Object.entries(MB_FORMAT_TRANSLATIONS).reduce((format, [mbToken, momentsToken]) => {
        return format.replace(mbToken, momentsToken);
    }, dateFormat);
}

function processReleaseEvents(events: NonNullable<Release['events']>): Array<[string, string[]]> {
    const dateToCountries = new Map<string, string[]>();
    for (const event of events) {
        const country = event.country?.primary_code;
        const date = stringifyDate(event.date ?? {});

        if (!dateToCountries.has(date)) {
            dateToCountries.set(date, []);
        }

        if (country) {
            dateToCountries.get(date)!.push(country);
        }
    }

    const arr = [...dateToCountries.entries()];
    arr.sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    });

    return arr;
}

export class CAAEdit {
    private readonly edit: Element;
    private readonly releaseDetails: Release;
    public readonly otherImages: CAAImage[];
    public readonly currentImage?: CAAImage;
    private readonly warningsUl: HTMLUListElement;
    private _selectedIdx = 0;
    private readonly warningMsgs: Set<string>;

    private anchor?: HTMLAnchorElement;
    private compareButton?: HTMLButtonElement;
    private typesSpan?: HTMLSpanElement;
    private nextButton?: HTMLButtonElement;
    private prevButton?: HTMLButtonElement;

    public constructor(edit: Element, releaseDetails: Release, otherImages: CAAImage[], currentImage?: CAAImage) {
        this.edit = edit;
        this.releaseDetails = releaseDetails;
        this.otherImages = otherImages;
        this.currentImage = currentImage;
        this.setTypes();
        this.insertReleaseInfo();
        this.insertComparisonImages();
        this.warningsUl = this.insertWarnings();
        this.warningMsgs = new Set();
        this.performSanityChecks();
    }

    private setTypes(): void {
        const trs = this.edit.querySelectorAll<HTMLTableRowElement>('table.details > tbody > tr');
        const typesRow = [...trs].find((tr) => tr.querySelector('th')!.textContent === 'Types:');
        if (!typesRow) {
            this.insertRow('Types:', <span data-name='artwork-type'>(none)</span>);
        } else {
            const td = typesRow.querySelector('td')!;
            const existingTypes = td.textContent!;
            const newSpans = existingTypes.split(', ')
                .map((type) => <span data-name='artwork-type'>{type}</span>);

            if (newSpans.length > 0) {
                td.innerHTML = '';
                td.append(...insertBetween(newSpans, ', '));
            }
        }
    }

    private insertWarnings(): HTMLUListElement {
        const warningsList = <ul />;
        const tr = <tr style={{ display: 'none' }}>
            <th>Warnings:</th>
            <td colSpan={2}>{warningsList}</td>
        </tr>;

        const rows = this.edit
            .querySelectorAll('.edit-details tr, .details tr');
        rows[rows.length - 1].after(tr);
        return warningsList as HTMLUListElement;
    }

    private insertRow(header: string, rowContent: HTMLElement | string | Array<HTMLElement | string>): void {
        if (!Array.isArray(rowContent)) {
            rowContent = [rowContent];
        }

        // FIXME: Nativejsx does not support spreading children.
        const td = <td/>;
        td.append(...rowContent);
        const row = <tr>
            <th>{header}</th>
            {td}
        </tr>;

        this.edit
            .querySelector('.edit-details tr, .details tr')
            ?.after(row);
    }

    private insertReleaseInfo(): void {
        const packaging = PACKAGING_TYPES[this.releaseDetails.packagingID] ?? '??';
        const status = STATUSES[this.releaseDetails.statusID] ?? '??';
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const format = this.releaseDetails.combined_format_name || '[missing media]';
        const events = processReleaseEvents(this.releaseDetails.events ?? []);
        const barcode = (this.releaseDetails.barcode ?? '??') || '[none]';

        const catnos = new Set((this.releaseDetails.labels ?? [])
            .map((lbl) => lbl.catalogNumber!)
            .filter(Boolean));
        const labels = new Set((this.releaseDetails.labels ?? [])
            .filter((lbl) => lbl.label)
            .map((lbl): [string, string] => [lbl.label!.gid, lbl.label!.name]));

        const detailsContent = insertBetween(
            [['Status', status], ['Packaging', packaging], ['Format', format]]
                .flatMap(([title, value]) => {
                    // FIXME: Another thing NativeJSX crashes on: Cannot put it into the array. More below.
                    const valueSpan = <span data-name={title}>{value}</span>;
                    return [`${title}: `, valueSpan];
                }),
            '; ');
        const eventsContent = insertBetween(
            events.flatMap(([evtDate, evtCountries]) => {
                const countries = (evtCountries.length <= 3 && evtCountries.length > 0)
                    ? evtCountries.join(', ')
                    : `${evtCountries.length} countries`;
                const releaseDateSpan = <span data-name='release-date'>{evtDate}</span>;
                return [releaseDateSpan, ` (${countries})`];
            }), '; ');
        const labelsContent = insertBetween(
            [...labels].map(([lblGid, lblName]) => <a href={`/label/${lblGid}`}>{lblName}</a>),
            ', ');

        const barcodeSpan = <span data-name='barcode'>{barcode}</span>;
        const identifiersContent = [`Cat#: ${[...catnos].join(', ') || '??'}; Barcode: `, barcodeSpan];

        // Opposite order in which it appears, since it always inserts in the
        // second row.
        this.insertRow('Identifiers:', identifiersContent);
        this.insertRow('Labels:', labelsContent);
        this.insertRow('Release events:', eventsContent);
        this.insertRow('Release details:', detailsContent);
    }

    private insertComparisonImages(): void {
        const td = this.edit.querySelector<HTMLTableCellElement>('td.ROpdebee_comparisonImage')!;
        if (this.otherImages.length === 0) {
            const span = <span>No other images found!</span>;
            td.append(span);
            td.classList.remove('ROpdebee_loading');
            return;
        }

        this.anchor = <a className='artwork-image' /> as HTMLAnchorElement;
        this.compareButton = <button type='button' style={{ float: 'right' }} onClick={openComparisonDialog.bind(null, this)}>Compare</button> as HTMLButtonElement;
        this.typesSpan = <span style={{ display: 'block' }} />;

        if (this.otherImages.length > 1) {
            this.nextButton = <button type='button' onClick={this.nextImage.bind(this)}>Next</button> as HTMLButtonElement;
            this.prevButton = <button type='button' onClick={this.prevImage.bind(this)}>Previous</button> as HTMLButtonElement;

            td.append(this.anchor, this.typesSpan, this.prevButton, this.nextButton, this.compareButton);
        } else {
            td.append(this.anchor, this.typesSpan, this.compareButton);
        }

        td.classList.remove('ROpdebee_loading');

        logFailure(this.setImage());
    }

    private set selectedIdx(newIdx: number) {
        if (newIdx < 0)
            newIdx = this.otherImages.length + newIdx;
        newIdx %= this.otherImages.length;
        this._selectedIdx = newIdx;
    }

    private get selectedIdx(): number {
        return this._selectedIdx;
    }

    public get selectedOtherImage(): CAAImage {
        return this.otherImages[this.selectedIdx];
    }

    public nextImage(): void {
        this.selectedIdx += 1;
        logFailure(this.setImage());
    }

    public prevImage(): void {
        this.selectedIdx -= 1;
        logFailure(this.setImage());
    }

    private async setImage(): Promise<void> {
        const selectedImg = this.otherImages[this.selectedIdx];
        const fullSizeUrl = fixCaaUrl(selectedImg.image);

        this.anchor!.href = fullSizeUrl;

        // Remove previous element, if any
        // We remove and add rather than just modify in place, because modifying
        // in place doesn't trigger the intersection observer
        this.edit.querySelectorAll('.ROpdebee_comparisonImage img, .ROpdebee_comparisonImage span.error')
            .forEach((elmt) => {
                elmt.remove();
            });

        // FIXME: nativejsx cannot handle JSX nested inside a lambda in a JSX handler.
        function createErrorSpan(message: string): HTMLSpanElement {
            return <span className='error' style={{ display: 'block' }}>{message}</span>;
        }

        const img = <img
            className='ROpdebee_loading'
            onLoad={(): void => { img.classList.remove('ROpdebee_loading'); }}
            onError={(): void => {
                const errorMsg = createErrorSpan('Unable to load this image');
                this.anchor!.prepend(errorMsg);
                img.classList.remove('ROpdebee_loading');
            }} /> as HTMLImageElement;
        img.setAttribute('fullSizeURL', fullSizeUrl);
        this.anchor!.prepend(img);
        this.typesSpan!.textContent = `Types: ${selectedImg.types.join(', ')}`;

        const imgUrl = await selectImage(selectedImg);
        if (!imgUrl) {
            img.dispatchEvent(new Event('error'));
        } else {
            img.src = imgUrl;
        }

        getDimensionsWhenInView(img);
    }

    private get closeDate(): Moment.Moment {
        const expire = (
            this.edit.id === 'content'
                ? this.edit.parentElement!.querySelector('#sidebar')
                : this.edit.querySelector('div.edit-description')
        )!.querySelector('.edit-expiration');

        const tooltip = expire!.querySelector<HTMLSpanElement>('span.tooltip');
        if (tooltip === null) {
            // "About to expire"
            return moment();
        }

        const dateStr = tooltip.title;
        return moment(
            dateStr,
            translateMBDateFormatToMoments(window.__MB__!.$c.user.preferences.datetime_format),
            window.__MB__!.$c.stash.current_language ?? 'en');
    }

    private get formats(): string[] {
        return this.releaseDetails.mediums
            .map((medium) => medium.format ? medium.format.name : 'unknown');
    }

    private get isDigitalMedia(): boolean {
        return this.formats.every((format) => format === 'Digital Media');
    }

    private get isPhysical(): boolean {
        return !this.formats.includes('Digital Media') && !this.formats.includes('unknown');
    }

    private get isVinyl(): boolean {
        return this.formats.some((format) => format.includes('Vinyl'));
    }

    private get isUnknownMedium(): boolean {
        return this.formats.length === 1 && this.formats[0] === 'unknown';
    }

    private get shouldBeNonSquare(): boolean {
        return NONSQUARE_PACKAGING_TYPES.has(this.releaseDetails.packagingID)
            && this.types.some((type) => NONSQUARE_PACKAGING_COVER_TYPES.has(type));
    }

    private get types(): string[] {
        return [...this.edit.querySelectorAll('span[data-name="artwork-type"]')]
            .map((span) => span.textContent!);
    }

    private markShady(elmts: HTMLElement | HTMLElement[], reason: string): void {
        if (!Array.isArray(elmts)) {
            elmts = [elmts];
        }

        if (elmts.length === 0) return;

        for (const elmt of elmts) {
            elmt.classList.add('ROpdebee_shady');
            const prevTitle = elmt.title;
            elmt.title = [prevTitle, reason].join(' ').trim();
        }

        if (!this.warningMsgs.has(reason)) {
            this.warningsUl.append(<li>{reason}</li>);
            this.warningsUl.closest('tr')!.style.display = '';
            this.warningMsgs.add(reason);
        }
    }

    // Sanity checks
    private performSanityChecks(): void {
        this.checkReleaseDate();
        this.checkPseudoReleaseCover();
        this.checkTypes();
        this.checkUrlInComment();
        logFailure(this.checkDimensions());
    }

    private checkReleaseDate(): void {
        if (!this.closeDate.isValid()) {
            this.markShady(
                [...this.edit.querySelectorAll<HTMLSpanElement>('span[data-name="release-date"]')],
                'Cannot determine the closing date of this edit, the release event check will not work. Please report this issue.');
            return;
        }
        const dates = new Set((this.releaseDetails.events ?? [])
            .filter((evt) => typeof evt.date?.year !== 'undefined' && typeof evt.date.month !== 'undefined' && typeof evt.date.day !== 'undefined')
            .map((evt): [RelationshipDate, Date] => [evt.date!, new Date(evt.date!.year!, evt.date!.month! - 1, evt.date!.day!)]));
        const closeDate = this.closeDate;

        const tooLateDates = new Set([...dates]
            .filter((d) => closeDate.isBefore(d[1]))
            .map((d) => stringifyDate(d[0])));

        const shadyDates = [...this.edit.querySelectorAll<HTMLSpanElement>('span[data-name="release-date"]')]
            .filter((el) => tooLateDates.has(el.textContent!));
        this.markShady(shadyDates, SHADY_REASONS.releaseDate);
    }

    private checkPseudoReleaseCover(): void {
        if (this.releaseDetails.statusID === 4) {
            this.markShady(this.edit.querySelector<HTMLSpanElement>('span[data-name="Status"]')!, SHADY_REASONS.pseudoRelease);
        }
    }

    public checkTypes(): void {
        this.edit.querySelectorAll<HTMLSpanElement>('span[data-name="artwork-type"]')
            .forEach(this._checkType.bind(this));
    }

    private _checkType(typeEl: HTMLSpanElement): void {
        const type = typeEl.textContent!;

        // Watermark types
        if (type === 'Watermark') {
            this.markShady(typeEl, SHADY_REASONS.watermark);
        }

        // Unexpected type on digital media
        if (!['Front', 'Track', '-', '(none)'].includes(type) && this.isDigitalMedia) {
            this.markShady(typeEl, SHADY_REASONS.digitalNonFront);
        }

        // No types set
        if (type === '-' || type === '(none)') {
            this.markShady(typeEl, SHADY_REASONS.noTypesSet);
        }

        // Track on physical release
        if (type === 'Track' && this.isPhysical) {
            this.markShady(typeEl, SHADY_REASONS.trackOnPhysical);
        }

        // Liner on non-Vinyl release
        if (type === 'Liner' && !this.isVinyl) {
            this.markShady(typeEl, SHADY_REASONS.linerOnNonVinyl);
        }

        // Obi on non-JP release
        if (type === 'Obi'
            && (this.releaseDetails.events || []).every((evt) => !evt.country || evt.country.primary_code !== 'JP')) {
            this.markShady(typeEl, SHADY_REASONS.obiOutsideJapan);
        }
    }

    private checkUrlInComment(): void {
        const trs = this.edit.querySelectorAll('table.details > tbody > tr');
        const commentRow = [...trs].find((tr) => tr.querySelector<HTMLTableCellElement>('th')!.textContent === 'Comment:');
        const commentEl = commentRow!.querySelector('td')!;
        if (commentEl.textContent!.includes('://')) {
            this.markShady(commentEl, SHADY_REASONS.urlInComment);
        }
    }

    private async checkDimensions(): Promise<void> {
        if (!this.currentImage)
            return;
        const dimensions = await getImageDimensions(fixCaaUrl(this.currentImage.image));

        if (!dimensions) {
            console.error('Failed to load image dimensions');
            return;
        }

        const aspectRatio = dimensions.width / dimensions.height;
        const isSquare = Math.abs(1 - aspectRatio) < .05;

        if (isSquare && this.shouldBeNonSquare) {
            this.markShady(this.edit.querySelector<HTMLSpanElement>('span[data-name="Packaging"]')!, SHADY_REASONS.incorrectDimensions);
        }

        if (!isSquare && this.isDigitalMedia) {
            this.markShady(this.edit.querySelector<HTMLSpanElement>('span[data-name="Format"]')!, SHADY_REASONS.nonsquareDigital);
        }

        const dimStr = `${dimensions.width}x${dimensions.height}`;
        if (LIKELY_DIGITAL_DIMENSIONS.has(dimStr) && !this.isDigitalMedia && !this.isUnknownMedium) {
            this.markShady(this.edit.querySelector<HTMLSpanElement>('span.ROpdebee_dimensions, span[data-name="Format"]')!, SHADY_REASONS.digitalDimensions);
        }
    }
}
