/* eslint-disable @typescript-eslint/explicit-function-return-type -- These are present in JSDoc comments. */

/**
 * Type declarations extracted from @octokit/rest. We could just add it as a
 * dev dependency, but we're currently only using it for GitHub Actions
 * github-script, so we don't need it in the repo and this avoids dependency
 * update spam. Since we don't need that many methods, we can just copy them
 * here.
 *
 * @typedef { Object } BasicRepoParams
 * @property { string } owner
 * @property { string } repo
 *
 * @typedef { Object } IssueComment
 * @property { number } id
 * @property { { login: string } } user
 *
 * @typedef { Object } IssuesEndpointMethods
 * @property { (params: BasicRepoParams & { issue_number: number; labels: string[] }) => Promise<unknown> } addLabels
 * @property { (params: BasicRepoParams & { issue_number: number; body: string }) => Promise<unknown> } createComment
 * @property { (params: BasicRepoParams & { comment_id: number; body: string }) => Promise<unknown> } updateComment
 * @property { (params: BasicRepoParams & { issue_number: number; per_page: number }) => Promise<{ data: IssueComment[] }> } listComments
 *
 * @typedef { Object } RestEndpointMethods
 * @property { IssuesEndpointMethods } issues
 *
 * @typedef { Object } Octokit
 * @property { RestEndpointMethods } rest
 */

/**
 * Type declarations extracted from https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts
 *
 * @typedef { Object } Context
 * @property { { owner: string; repo: string } } repo
 * @property { number } runId
 * @property { number } runNumber
 * @property { string } workflow
 */

/**
 * Type declarations for information we set in CI.
 *
 * @typedef { Object } PRInfo
 * @property { number } number
 * @property { string } title
 * @property { string[] } labels
 *
 * @typedef { import('./deploy').DeployInfo } DeployInfo
 */

/**
 * @return { Promise<void> }
 * @param { { github: Octokit; context: Context } } args
 */
async function reportDeploy({ github, context }) {
    const { TEST_RESULT, DEPLOY_RESULT } = process.env;

    if (!process.env.PR_INFO || !process.env.DEPLOY_INFO) {
        throw new Error('Required environment variables not set, are we running in CI?');
    }

    /** @type PRInfo */
    const prInfo = JSON.parse(process.env.PR_INFO);
    /** @type DeployInfo */
    const deployInfo = JSON.parse(process.env.DEPLOY_INFO);

    // Set labels on PR
    /** @type string */
    // eslint-disable-next-line no-restricted-syntax
    let label;
    if (TEST_RESULT !== 'success' || DEPLOY_RESULT !== 'success') {
        label = 'deploy:failed';
    } else if (!deployInfo.scripts.length) {
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
    } else if (deployInfo.scripts.length) {
        // Report deployed versions
        issueComment = [
            `:rocket: Released ${deployInfo.scripts.length} new userscript version(s):`,
        ].concat(deployInfo.scripts.map((script) => {
            return `* ${script.name} ${script.version} in ${script.commit}`;
        })).join('\n');
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
 * @param { { github: Octokit; context: Context } } args
 */
async function reportPreview({ github, context }) {
    if (!process.env.PR_INFO || !process.env.DEPLOY_INFO) {
        throw new Error('Required environment variables not set, are we running in CI?');
    }

    /** @type PRInfo */
    const prInfo = JSON.parse(process.env.PR_INFO);
    /** @type DeployInfo */
    const deployInfo = JSON.parse(process.env.DEPLOY_INFO);

    /** @type string */
    // eslint-disable-next-line no-restricted-syntax
    let content;
    if (!deployInfo.scripts.length) {
        content = 'This PR makes no changes to the built userscripts.';
    } else {
        const basePreviewUrl = `https://raw.github.com/${context.repo.owner}/${context.repo.repo}/dist-preview-${prInfo.number}`;
        const diffUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/compare/dist...dist-preview-${prInfo.number}`;
        content = [
            `This PR changes ${deployInfo.scripts.length} built userscript(s):`,
        ].concat(deployInfo.scripts.map((script) => {
            const previewUrl = basePreviewUrl + '/' + script.name + '.user.js';
            return `* \`${script.name}\` ([install preview](${previewUrl}), changes: ${script.commit})`;
        })).concat([
            '',
            `[See all changes](${diffUrl})`,
        ]).join('\n');
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

    if (existingBotCommentIds.length) {
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


module.exports = {
    reportDeploy,
    reportPreview,
};
