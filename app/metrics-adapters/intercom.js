import IntercomAdapter from 'ember-metrics/metrics-adapters/intercom';
import { compact, without } from 'ember-metrics/utils/object-transforms';
import canUseDOM from 'ember-metrics/utils/can-use-dom';
import get from 'ember-metal/get';

/**
 * Override the ember-metrics Intercom adapter to support guest users.
 *
 * This can be turned into a Pull Request later on.
 */
export default IntercomAdapter.extend({
  identify(options = {}) {
    const { appId } = get(this, 'config');
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');

    props.app_id = appId;
    if (distinctId) {
      props.user_id = distinctId;
    }

    const method = this.booted ? 'update' : 'boot';
    if (canUseDOM) {
      window.Intercom(method, props);
      this.booted = true;
    }
  }
});
