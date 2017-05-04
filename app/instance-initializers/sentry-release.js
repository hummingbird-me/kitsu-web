import config from 'client/config/environment';

export function initialize() {
  if (config.environment === 'production' && window.Raven) {
    window.Raven.setRelease(config.release);
  }
}

export default {
  name: 'sentry-release',
  after: 'sentry-setup', // https://github.com/damiencaselli/ember-cli-sentry
  initialize
};
