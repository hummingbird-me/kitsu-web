import RavenLogger from 'ember-cli-sentry/services/raven';
import get from 'ember-metal/get';

export default RavenLogger.extend({
  errorsToIgnore: ['TransitionAborted'],

  ignoreError(reason) {
    const { message } = reason;
    return get(this, 'errorsToIgnore').any(error => message.includes(error));
  },
});
