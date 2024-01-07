/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Cannot fix this in JS code. */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- These are present in JSDoc comments. */

/**
 * Use JSDoc type defs to do type imports.
 * @typedef { import('./types-deploy').DeployInfo } DeployInfo
 * @typedef { import('./types-deploy').PullRequestInfo } PullRequestInfo
 * @typedef { import('./types-deploy').Octokit } Octokit
 * @typedef { import('./types-deploy').GithubActionsContext } GithubActionsContext
 */

/**
 * @return { Promise<void> }
 * @param { { github: Octokit; context: GithubActionsContext } } args
 */
export async function reportDeploy({ github, context }) {
    const { TEST_RESULT, DEPLOY_RESULT, PR_INFO, DEPLOY_INFO } = process.env;

    if (!PR_INFO) {
        throw new Error('PR info not set, are we running in CI?');
    }

    /** @type PullRequestInfo */
    const prInfo = JSON.parse(PR_INFO);
    /** @type DeployInfo | null */
    const deployInfo = DEPLOY_INFO ? JSON.parse(DEPLOY_INFO) : null;

    // Set labels on PR
    /** @type string */
    // eslint-disable-next-line no-restricted-syntax
    let label;
    if (TEST_RESULT !== 'success' || DEPLOY_RESULT !== 'success') {
        label = 'deploy:failed';
    } else if (!deployInfo || deployInfo.scripts.length === 0) {
        label = 'deploy:skipped';
    } else {
        label = 'deploy:success';
    }
    await github.rest.issues.addLabels({
        issue_number: prInfo.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        labels: [label],
    });

    // Leave a comment is deployment succeeded or failed, but not if it was skipped.
    /** @type string | undefined */
    // eslint-disable-next-line no-restricted-syntax
    let issueComment;
    if (TEST_RESULT !== 'success' || DEPLOY_RESULT !== 'success') {
        // Warn if deployment is skipped due to failures
        const runUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
        issueComment = [
            ':boom: Heads up! Automatic deployment of the changes in this PR failed! :boom:',
            `See [${context.workflow}#${context.runNumber}](${runUrl}).`,
        ].join('\n');
    } else if (deployInfo && deployInfo.scripts.length > 0) {
        // Report deployed versions
        const deployedScriptsLines = deployInfo.scripts.map((script) => {
            return `* ${script.name} ${script.version} in ${script.commit}`;
        });
        const commentLines = [
            `:rocket: Released ${deployInfo.scripts.length} new userscript version(s):`,
            ...deployedScriptsLines,
        ];
        issueComment = commentLines.join('\n');
    }

    if (issueComment) {
        await github.rest.issues.createComment({
            issue_number: prInfo.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: issueComment,
        });
    }
}

/**
 * @return { Promise<void> }
 * @param { { github: Octokit; context: GithubActionsContext } } args
 */
export async function reportPreview({ github, context }) {
    if (!process.env.PR_INFO) {
        throw new Error('PR info not set, are we running in CI?');
    }

    /** @type PullRequestInfo */
    const prInfo = JSON.parse(process.env.PR_INFO);
    /** @type DeployInfo | null */
    const deployInfo = process.env.DEPLOY_INFO ? JSON.parse(process.env.DEPLOY_INFO) : null;

    /** @type string */
    // eslint-disable-next-line no-restricted-syntax
    let content;
    if (!deployInfo || deployInfo.scripts.length === 0) {
        content = 'This PR makes no changes to the built userscripts.';
    } else {
        const basePreviewUrl = `https://raw.github.com/${context.repo.owner}/${context.repo.repo}/dist-preview-${prInfo.number}`;
        const diffUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/compare/dist...dist-preview-${prInfo.number}`;
        const changedScriptsLines = deployInfo.scripts.map((script) => {
            const previewUrl = basePreviewUrl + '/' + script.name + '.user.js';
            return `* \`${script.name}\` ([install preview](${previewUrl}), changes: ${script.commit})`;
        });
        content = [
            `This PR changes ${deployInfo.scripts.length} built userscript(s):`,
            ...changedScriptsLines,
            '',
            `[See all changes](${diffUrl})`,
        ].join('\n');
    }

    const existingComments = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prInfo.number,
        per_page: 100, // Will we ever go over 100 comments on a PR? We'll have to paginate then.
    });
    const existingBotCommentIds = existingComments.data
        .filter((comment) => comment.user.login === 'github-actions[bot]')
        .map((comment) => comment.id);

    if (existingBotCommentIds.length > 0) {
        const commentId = existingBotCommentIds[existingBotCommentIds.length - 1];
        await github.rest.issues.updateComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: commentId,
            body: content,
        });
    } else {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: prInfo.number,
            body: content,
        });
    }
}
