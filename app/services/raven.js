import RavenLogger from 'ember-cli-sentry/services/raven';
import get from 'ember-metal/get';

export default RavenLogger.extend({
  errorsToIgnore: [
    'TransitionAborted'
  ],

  ignoreError(reason) {
    if (!this.shouldReportError()) {
      return;
    }
    const { message } = reason;
    return get(this, 'errorsToIgnore').any(error => message.includes(error));
  },

  /**
   * Sentry recommends only reporting a small subset of the actual
   * frontend errors. This can get *very* noisy otherwise.
   */
  shouldReportError() {
    return (Math.random() * 100 <= 10);
  }
});
