import RavenLogger from 'ember-cli-sentry/services/raven';
import { typeOf } from 'ember-utils';

export default RavenLogger.extend({
  ignoreError(reason) {
    if (typeOf(reason) === 'object' && reason.message === 'TransitionAborted') {
      return true;
    }
    return this._super(...arguments);
  }
});
