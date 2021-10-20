// @ts-expect-error Not typescript
async function reportDeploy({ github, context }) {
    const { TEST_RESULT, DEPLOY_RESULT } = process.env;
    const prInfo = JSON.parse(process.env.PR_INFO || '{}');
    const deployInfo = JSON.parse(process.env.DEPLOY_INFO || '{}');

    // Set labels on PR
    let label;
    if (TEST_RESULT !== 'success' || DEPLOY_RESULT !== 'success') {
        label = 'deploy:failed';
    } else if (!deployInfo.scripts || !deployInfo.scripts.length) {
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

    let issueComment;
    if (TEST_RESULT !== 'success' || DEPLOY_RESULT !== 'success') {
        // Warn if deployment is skipped due to failures
        const runUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
        issueComment = [
            ':boom: Heads up! Automatic deployment of the changes in this PR failed! :boom:',
            `See [${context.workflow}#${context.runNumber}](${runUrl}).`
        ].join('\n');
    } else if (deployInfo.scripts && deployInfo.scripts.length) {
        // Report deployed versions
        issueComment = [
            `:rocket: Released ${deployInfo.scripts.length} new userscript version(s):`
        // @ts-expect-error Not typescript
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

// @ts-expect-error Not typescript
async function reportPreview({ github, context, full }) {
    const prInfo = JSON.parse(process.env.PR_INFO || '{}');
    const deployInfo = JSON.parse(process.env.DEPLOY_INFO || '{}');

    let content;
    if (!deployInfo.scripts || !deployInfo.scripts.length) {
        content = 'This PR makes no changes to the built userscripts.';
    } else if (full) {
        const basePreviewUrl = `https://raw.github.com/${context.repo.owner}/${context.repo.repo}/dist-preview-${prInfo.number}`;
        const diffUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/compare/dist...dist-preview-${prInfo.number}`;
        content = [
            `This PR changes ${deployInfo.scripts.length} built userscript(s):`
        // @ts-expect-error not typescript
        ].concat(deployInfo.scripts.map((script) => {
            const previewUrl = basePreviewUrl + '/' + script.name + '.user.js';
            return `* \`${script.name}\` ([install preview](${previewUrl}), changes: ${script.commit})`;
        })).concat([
            '',
            `[See all changes](${diffUrl})`,
        ]).join('\n');
    } else {
        content = [
            `This PR changes ${deployInfo.scripts.length} built userscript(s):`
        // @ts-expect-error not typescript
        ].concat(deployInfo.scripts.map((script) => {
            return `* \`${script.name}\``;
        }).concat([
            '',
            '_Comment /preview to generate a preview of the deployed changes. Available to collaborators only._',
        ])).join('\n');
    }

    const existingComments = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prInfo.number,
        per_page: 100, // Will we ever go over 100 comments on a PR? We'll have to paginate then.
    });
    const existingBotCommentIds = existingComments.data
        // @ts-expect-error not typescript
        .filter((comment) => comment.user.login === 'github-actions[bot]')
        // @ts-expect-error not typescript
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
