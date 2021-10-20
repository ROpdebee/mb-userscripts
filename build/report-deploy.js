// @ts-expect-error Not typescript
module.exports = async ({ github, context }) => {
    const { TEST_RESULT, DEPLOY_RESULT } = process.env;
    const prInfo = JSON.parse(process.env.PR_INFO || '{}');
    const deployInfo = JSON.parse(process.env.DEPLOY_INFO || '{}');

    // Set labels on PR
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
};
