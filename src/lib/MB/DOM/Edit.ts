import { filterNonNull, findRight } from '../../util/array';
import { assert, assertDefined, assertNonNull } from '../../util/assert';
import { qs, qsa, qsMaybe } from '../../util/dom';

/**
 * The possible types of votes.
 */
export enum Vote {
    None = 'None',
    Yes = 'Yes',
    No = 'No',
    Abstain = 'Abstain',
    Approve = 'Approve',
}

type VoteKey = keyof typeof Vote;

/**
 * Edit statuses that can be queried via class name.
 */
export enum QueryableStatus {
    Open = 'Open',
    Applied = 'Applied',
    FailedVote = 'Failed vote',
    Cancelled = 'Cancelled',
}

/**
 * Edit statuses which cannot be queried via class name.
 *
 * Their class is always edit-error, with no distinction between the different
 * errors.
 */
export enum NonQueryableStatus {
    FailedDependency = 'Failed dependency',
    Error = 'Error',
    FailedPrerequisite = 'Failed prerequisite',
    NoVotes = 'No votes',
}

/**
 * Edit statuses.
 */
export const Status = {...QueryableStatus, ...NonQueryableStatus};
export type Status = QueryableStatus | NonQueryableStatus;

type StatusKey = keyof typeof Status;

const STATUS_TEXT_TO_STATUS: Map<string, Status> = new Map(
    Object.values(Status)
        .map((status) => [status as string, status]));

/**
 * Vote counts for an edit.
 */
export interface Votes {
    yes: number
    no: number
}

export abstract class Edit {

    /**
     * Add a listener which is called when a vote changes.
     *
     * The listener is called with the edit of which the vote changed.
     *
     * @param      {(edit:Edit)=>void}  listener  The listener.
     */
    static onVoteChanged(listener: (edit: Edit) => void): void {
        qsMaybe<HTMLFormElement>('#edits > form, .edit-header ~ form')
            ?.addEventListener('change', (evt: Event) => {
                if (!(evt.target instanceof HTMLInputElement)) return;
                if (!(evt.target.name.startsWith('enter-vote.vote.') && evt.target.name.endsWith('.vote'))) return;

                const targetEdit = this.editFactory(evt.target);
                listener(targetEdit);
            });
    }

    /**
     * Get all edits on a page, optionally filtered by their status.
     *
     * @param      {QueryableStatus}  editStatus  The edit status
     * @return     {Edit[]}           The matching edits.
     */
    static getEdits(editStatus?: QueryableStatus): Edit[] {
        return this.queryEdits({ editStatus });
    }

    /**
     * Get all edits of a certain type on a page, optionally filtered by
     * status.
     *
     * @param      {string}           editType    The edit type
     * @param      {QueryableStatus}  editStatus  The edit status
     * @return     {Edit[]}           The edits of type.
     */
    static getEditsOfType(editType: string, editStatus?: QueryableStatus): Edit[] {
        return this.queryEdits({ editType, editStatus });
    }

    private static queryEdits(
        queryOptions: { editType?: string, editStatus?: QueryableStatus }
    ): Edit[] {
        const classes = filterNonNull(
            ['edit-header', queryOptions.editStatus, queryOptions.editType]);
        const query = ['div', ...classes].join('.');

        return qsa<HTMLDivElement>(query)
            .map(this.editFactory);
    }

    /**
     * Create an edit from an edit inner element.
     *
     * @param      {HTMLElement}  editElement  The edit element
     * @return     {Edit}         An edit wrapping the DIV.
     */
    private static editFactory(editElement: HTMLElement): Edit {
        const listContainer = editElement.closest<HTMLDivElement>('div.edit-list');
        if (listContainer !== null) {
            return new EditList(listContainer);
        } else {
            const pageDiv = editElement.closest<HTMLDivElement>('div#page');
            assertNonNull(pageDiv, 'Cannot find edit container from element');
            return new EditSingle(pageDiv);
        }
    }

    abstract get baseContainer(): HTMLDivElement

    /**
     * Get vote options element. Can be null in case the edit is closed.
     *
     * @type       {(HTMLDivElement|null)}
     */
    get voteOpts(): HTMLDivElement | null {
        const voteOpts = qsMaybe<HTMLDivElement>('.voteopts', this.baseContainer);
        assert(voteOpts !== null || !this.isOpen, 'Cannot find vote options on open edit');
        return voteOpts;
    }

    get editHeader(): HTMLDivElement {
        const editHeader = qs<HTMLDivElement>('.edit-header', this.baseContainer);
        return editHeader;
    }

    get id(): number {
        const editIDInput = qs<HTMLInputElement>('input[name$=".edit_id"]', this.baseContainer);
        return parseInt(editIDInput.value);
    }

    /**
     * Determines if edit is open.
     */
    get isOpen(): boolean {
        return this.status === Status.Open;
    }

    /**
     * Get edit status.
     */
    abstract get status(): Status

    /**
     * Get edit type.
     *
     * @return     {string}  The edit type, as the class name of the edit.
     */
    get type(): string {
        // FIXME: This isn't reliable.
        return this.editHeader.classList[3];
    }

    /**
     * Get editor's own vote on this edit.
     */
    get myVote(): Vote {
        const voteOpts = this.voteOpts;
        if (voteOpts == null) {
            return this.myOldVote;
        }

        const selectedInput = qs<HTMLInputElement>('input:checked', voteOpts);
        const vote = selectedInput.id.split('-').at(-1);
        assertDefined(vote, 'Cannot find vote');
        return Vote[vote as VoteKey];
    }

    protected abstract get myOldVote(): Vote

    /**
     * Get a count of votes on this edit. May be null.
     *
     * The result may be null if the vote count cannot be retrieved from the
     * page, i.e. on open edits in edit lists.
     *
     * @return     {Votes}  The vote count, or null.
     */
    abstract get votes(): Votes | null

    protected extractVoteCount(voteCount: HTMLElement): Votes {
        const counts = qsa<HTMLElement>('strong', voteCount);
        const countsInt = counts.map((countElt) => parseInt(countElt.textContent ?? '0'));
        return {yes: countsInt[0], no: countsInt[1]};
    }

    /**
     * Name of the editor who made the edit.
     */
    get editor(): string {
        return qsMaybe<HTMLElement>('p.subheader > a > bdi', this.editHeader)?.textContent ?? '';
    }

    /**
     * Determines if edit is editor's own edit.
     */
    get isOwnEdit(): boolean {
        return this.editor === __MB__.$c.user.name;
    }
}

/**
 * Edits on a single edit page.
 */
class EditSingle extends Edit {
    private pageDiv: HTMLDivElement

    constructor(pageDiv: HTMLDivElement) {
        super();
        this.pageDiv = pageDiv;
    }

    override get baseContainer() {
        return this.pageDiv;
    }

    override get votes() {
        const voteCount = qs<HTMLTableDataCellElement>('table.vote-tally tr:first() > td.vote', this.pageDiv);
        return this.extractVoteCount(voteCount);
    }

    override get myOldVote() {
        assert(!this.isOpen, 'Cannot get old vote of open edit');

        const voteTallyRows = qsa<HTMLTableRowElement>('table.vote-tally tr', this.pageDiv);
        const lastVoteRow = findRight(
            voteTallyRows,
            (voteRow) => voteRow.cells[0].textContent === __MB__.$c.user.name);
        const vote = Vote[(lastVoteRow?.cells[1].textContent ?? 'None') as VoteKey];
        assertDefined(vote);
        return vote;
    }

    override get status() {
        // FIXME: This won't work on non-English pages.
        const statusText = qs<HTMLElement>('#sidebar > .edit-status > dd', this.pageDiv).textContent;
        const status = STATUS_TEXT_TO_STATUS.get(statusText ?? '');
        assertDefined(status);
        return status;
    }
}

/**
 * Edits in an edit list.
 */
class EditList extends Edit {
    private listDiv: HTMLDivElement

    constructor(listDiv: HTMLDivElement) {
        super();
        this.listDiv = listDiv;
    }

    override get baseContainer() {
        return this.listDiv;
    }

    override get votes() {
        if (this.isOpen) return null;
        const voteCount = qs<HTMLDivElement>('td.vote-count > div', this.editHeader);
        return this.extractVoteCount(voteCount);
    }

    override get myOldVote() {
        assert(!this.isOpen, 'Cannot get old vote of open edit');

        const oldVoteDiv = qs<HTMLDivElement>('div.my-vote', this.editHeader);
        const vote = Vote[oldVoteDiv.childNodes[2].textContent as VoteKey];
        assertDefined(vote);
        return vote;
    }

    override get status() {
        // FIXME: This won't work on non-English pages.
        if (this.editHeader.classList.contains('open')) return Status.Open;
        if (this.editHeader.classList.contains('applied')) return Status.Applied;

        const statusText = qs('.edit-actions > .edit-status', this.listDiv).textContent;
        const status = STATUS_TEXT_TO_STATUS.get(statusText ?? '');
        assertDefined(status);
        return status;
    }
}

