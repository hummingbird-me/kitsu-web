import config from 'client/config/environment';

/**
 * This will update the version config option for display using the `ember-cli-app-version`
 * `{{app-version}}` helper but will not update the registered library version as that happens
 * prior to this initializer.
 *
 * The primary point of this is to register heroku deploys as different versions for third party
 * trackers.
 */
export function initialize() {
  if (config.APP.heroku) {
    const version = config.APP.version;
    config.APP.version = `${version}-${config.APP.gitCommit}`;
  }
}

export default {
  name: 'heroku-version',
  initialize
};
