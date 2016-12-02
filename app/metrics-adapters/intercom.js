import IntercomAdapter from 'ember-metrics/metrics-adapters/intercom';
import { compact, without } from 'ember-metrics/utils/object-transforms';
import canUseDOM from 'ember-metrics/utils/can-use-dom';
import get from 'ember-metal/get';
import { assert } from 'ember-metal/utils';

/**
 * Override the ember-metrics Intercom adapter to support guest users.
 *
 * This can be turned into a Pull Request later on.
 */
export default IntercomAdapter.extend({
  init() {
    const { appId } = get(this, 'config');

    assert(`[ember-metrics] You must pass a valid \`appId\` to the ${this.toString()} adapter`, appId);

    if (canUseDOM) {
      /* eslint-disable */
      (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',{});}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;
      s.src=`https://widget.intercom.io/widget/${appId}`;
      var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);} l(); }})()
      /* eslint-enable */
    }
  },

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
  },

  trackEvent() { }
});
