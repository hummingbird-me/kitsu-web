import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import canUseDOM from 'ember-metrics/utils/can-use-dom';
import { assert } from 'ember-metal/utils';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import jQuery from 'jquery';
import Config from 'client/config/environment';

export default BaseAdapter.extend({
  client: undefined,
  // We never want to send analytics for Stream for a guest
  userSet: false,
  router: service('-routing'),

  toStringExtension() {
    return 'Stream';
  },

  init() {
    const environment = Config.isStaging ? 'staging' : Config.environment;
    const config = get(this, `config.${environment}`);
    assert('[ember-metrics] You must pass a valid `apiKey` and `token` to this adapter',
      get(config, 'apiKey') && get(config, 'token'));

    if (canUseDOM) {
      // Stream Analytics Import
      // eslint-disable-next-line
      !function(t,e){t("StreamAnalytics","https://d2j1fszo1axgmp.cloudfront.net/2.6.0/stream-analytics.min.js",e)}(function(t,e,n){var s,i,r;n["_"+t]={},n[t]=function(e){n["_"+t].clients=n["_"+t].clients||{},n["_"+t].clients[e.apiKey]=this,this._config=e};var c=function(t){return function(){return this["_"+t]=this["_"+t]||[],this["_"+t].push(arguments),this}};s=["setUser","trackImpression","trackEngagement"];for(var a=0;a<s.length;a++){var o=s[a];n[t].prototype[o]=c(o)}i=document.createElement("script"),i.async=!0,i.src=e,r=document.getElementsByTagName("script")[0],r.parentNode.insertBefore(i,r)},window);

      // Initialize Client
      const client = new window.StreamAnalytics(config);
      set(this, 'client', client);
    }
  },

  identify(options = {}) {
    const { distinctId: id, alias } = options;

    // exit out if this is a guest identification
    if (id === undefined || alias === undefined) {
      return;
    }

    if (canUseDOM) {
      get(this, 'client').setUser({ id, alias });
      set(this, 'userSet', true);
    }
  },

  /**
   * Usage:
   *    get(this, 'metrics').invoke('trackImpression', 'Stream', { ... });
   *
   * @param {String[]|Object[]} content_list The list of content the user is
   *  looking at. Either a list of IDs or objects.
   * @param {String} [feed_id] The feed the user is looking at.
   * @param {String} [location] The location in your app. ie email, homepage, profile page etc.
   */
  trackImpression(data) {
    if (canUseDOM && get(this, 'userSet')) {
      const options = Object.assign({
        location: get(this, 'router.currentRouteName')
      }, data);
      get(this, 'client').trackImpression(options);
    }
  },

  /**
   * Usage:
   *    get(this, 'metrics').invoke('trackEngagement', 'Stream', { ... });
   *
   * @param {String} label The type of event, ie click, share, search.
   * @param {String|Object} content The content that the engagement relates to,
   *  either as an ID or content object.
   * @param {String} [position] The position in a list of activities, starting at 0.
   * @param {String} [boost] The boost factor allows you to indicate this engagment
   *  is more important. Specifying 2 here means the engagement is twice as
   *  important as other engagements with the same label.
   * @param {String} [feed_id] The feed the user is looking at.
   * @param {String} [location] The location in your app. ie email, homepage, profile page etc.
   */
  trackEngagement(data) {
    if (canUseDOM && get(this, 'userSet')) {
      const options = Object.assign({
        location: get(this, 'router.currentRouteName')
      }, data);
      get(this, 'client').trackEngagement(options);
    }
  },

  /**
   * NOOP the `ember-metrics` functions as Stream will be invoked with very
   * specific data.
   */
  trackEvent() {},
  trackPage() {},

  willDestroy() {
    if (canUseDOM) {
      jQuery('script[src*="stream-analytics"]').remove();
    }
  }
});
