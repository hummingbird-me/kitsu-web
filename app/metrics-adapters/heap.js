import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { compact, without } from 'ember-metrics/utils/object-transforms';
import canUseDOM from 'ember-metrics/utils/can-use-dom';
import get from 'ember-metal/get';
import { assert } from 'ember-metal/utils';
/* global heap */

/**
 * Heap Analytics -- https://heapanalytics.com
 */
export default BaseAdapter.extend({
  toStringExtension() {
    return 'Heap';
  },

  init() {
    const { appId } = get(this, 'config');
    assert(`[ember-metrics] You must pass a valid \`appId\` to the ${this.toString()} adapter`, appId);
    if (canUseDOM) {
      /* eslint-disable */
      window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
      heap.load(appId);
      /* eslint-enable */
    }
  },

  identify(options = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    const props = without(compactedOptions, 'distinctId', 'alias');
    if (canUseDOM && distinctId) {
      heap.identify(distinctId);
      heap.addUserProperties(props);
    }
  },

  trackEvent() {},
  trackPage() {},
});
