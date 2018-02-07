import Ember from 'ember';
import RavenLogger from 'ember-cli-sentry/services/raven';

// Reference Travis: https://github.com/travis-ci/travis-web/blob/master/app/services/raven.js
export default RavenLogger.extend({
  benignErrors: [
    'TaskCancelation',
    'TaskInstance',
    'TransitionAborted',
    'UnrecognizedURLError',
    'not found',
    'returned a 403',
    'returned a 404',
    'operation failed',
    'operation was aborted'
  ],
  unhandledPromiseErrorMessage: '',

  captureException(error) {
    if (!this.ignoreError(error)) {
      this._super(...arguments);
    }
  },

  ignoreError(error) {
    if (!this.shouldReportError()) {
      return true;
    }
    const { message } = error;
    return this.get('benignErrors').any(benign => message.includes(benign));
  },

  shouldReportError() {
    if (Ember.testing) { return false; }
    const sampleRate = 10;
    return (Math.random() * 100 <= sampleRate);
  }
});
