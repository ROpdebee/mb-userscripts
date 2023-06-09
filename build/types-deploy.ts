/**
 * Type definitions used in deployment.
 *
 * Factored into separate file because some are used in JS code.
 */

/** Information about a deployed script. */
export interface DeployedScript {
    /** Script name. */
    name: string;
    /** Deployed version. */
    version: string;
    /** Commit in which script is deployed. */
    commit: string;
}

/** Information about multiple deployed scripts. */
export interface DeployInfo {
    /** Array of deployment information of multiple scripts. */
    scripts: DeployedScript[];
}

/** Information about pull requests. */
export interface PullRequestInfo {
    /** PR number. */
    number: number;
    /** PR title. */
    title: string;
    /** URL to the PR. */
    url: string;
    /** Labels applied to the PR. */
    labels: string[];
}

/** Payload of a GitHub push event (incomplete). */
export interface PushEventPayload {
    before: string;
}

/** Payload of a GitHub repository dispatch event (incomplete). */
export interface RepositoryDispatchEventPayload {
    client_payload: {
        pull_request: {
            base: {
                ref: string;
            };
        };
    };
}

/*
 * Type declarations extracted from @octokit/rest. We could just add it as a
 * dev dependency, but we're currently only using it for GitHub Actions
 * github-script, so we don't need it in the repo and this avoids dependency
 * update spam. Since we don't need that many methods, we can just copy them
 * here.
 */

interface BasicRepoParams {
    owner: string;
    repo: string;
}

interface IssueComment {
    id: number;
    user: {
        login: string;
    };
}

interface IssuesEndpointMethods {
    addLabels(params: BasicRepoParams & { issue_number: number; labels: string[] }): Promise<unknown>;
    createComment(params: BasicRepoParams & { issue_number: number; body: string }): Promise<unknown>;
    updateComment(params: BasicRepoParams & { comment_id: number; body: string }): Promise<unknown>;
    listComments(params: BasicRepoParams & { issue_number: number; per_page: number }): Promise<{ data: IssueComment[] }>;
}

export interface Octokit {
    rest: {
        issues: IssuesEndpointMethods;
    };
}

/*
 * Type declarations extracted from https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts
 */

export interface GithubActionsContext {
    repo: {
        owner: string;
        repo: string;
    };
    runId: number;
    runNumber: number;
    workflow: string;
}
