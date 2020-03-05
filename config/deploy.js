/* eslint-env node */

module.exports = function(deployTarget) {
  const ENV = {
    build: {},
    s3: {
      bucket: 'kitsu-web',
      region: 'us-east-1'
    },
    's3-index': {
      bucket: 'kitsu-web',
      region: 'us-east-1'
    },
    'revision-data': {
      // Use Git Commit ID for the revision key
      type: 'git-commit'
    },
    slack: {
      webhookURL: 'https://hooks.slack.com/services/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',
      didDeploy: context => slack => slack.notify({
        attachments: [{
          fallback: 'Deployment finished! New revision was successfully uploaded.',
          pretext: 'Deployment finished! New revision was successfully uploaded.',
          color: 'good',
          fields: [
            {
              title: 'View',
              value: `https://${context.revisionData.revisionKey}.production.kitsu.io/`,
              short: false
            }
          ]
        }]
      })
    }
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
