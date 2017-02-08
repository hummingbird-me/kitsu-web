import RavenLogger from 'ember-cli-sentry/services/raven';
import get from 'ember-metal/get';

export default RavenLogger.extend({
  errorsToIgnore: ['TransitionAborted'],

  ignoreError(error) {
    const { message } = error;
    if (!message) { return false; }
    return get(this, 'errorsToIgnore').any(ignored => message.includes(ignored));
  },

  logException(error) {
    if (!this.ignoreError(error)) {
      this.captureException(error);
    }
  }
});
