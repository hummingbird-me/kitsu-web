import RavenLogger from 'ember-cli-sentry/services/raven';
import get from 'ember-metal/get';

export default RavenLogger.extend({
  errorsToIgnore: ['TransitionAborted'],

  ignoreError(error) {
    const { message } = error;
    return get(this, 'errorsToIgnore').any(error => message.includes(error));
  },

  logException(error) {
    if (!this.ignoreError(error)) {
      this.captureException(error);
    }
  }
});
