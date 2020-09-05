import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { get, set } from '@ember/object';
import jQuery from 'jquery';
import Config from 'client/config/environment';
import canUseDOM from 'client/utils/can-use-dom';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'Stream';
  },

  init() {
    if (Config.kitsu.isProduction) {
      const environment = Config.kitsu.isStaging ? 'staging' : Config.environment;
      const config = get(this, `config.${environment}`);
      if (canUseDOM) {
        // eslint-disable-next-line
        !function(t,e){t("StreamAnalytics","https://d2j1fszo1axgmp.cloudfront.net/2.6.0/stream-analytics.min.js",e)}(function(t,e,n){var s,i,r;n["_"+t]={},n[t]=function(e){n["_"+t].clients=n["_"+t].clients||{},n["_"+t].clients[e.apiKey]=this,this._config=e};var c=function(t){return function(){return this["_"+t]=this["_"+t]||[],this["_"+t].push(arguments),this}};s=["setUser","trackImpression","trackEngagement"];for(var a=0;a<s.length;a++){var o=s[a];n[t].prototype[o]=c(o)}i=document.createElement("script"),i.async=!0,i.src=e,r=document.getElementsByTagName("script")[0],r.parentNode.insertBefore(i,r)},window);
        const client = new window.StreamAnalytics(config);
        set(this, 'client', client);
      }
    }
  },

  identify(options = {}) {
    const { distinctId: id, alias } = options;
    if (canUseDOM && id && alias) {
      get(this, 'client').setUser({ id, alias });
      set(this, 'hasUser', true);
    }
  },

  trackEvent() {},
  trackPage() {},

  trackImpression(data) {
    const router = get(this.this, 'router');
    if (canUseDOM && get(this, 'hasUser')) {
      const options = { location: get(router, 'currentRouteName'), ...data };
      get(this, 'client').trackImpression(options);
    }
  },

  trackEngagement(data) {
    const router = get(this.this, 'router');
    if (canUseDOM && get(this, 'hasUser')) {
      const options = { location: get(router, 'currentRouteName'), ...data };
      get(this, 'client').trackEngagement(options);
    }
  },

  willDestroy() {
    if (canUseDOM) {
      jQuery('script[src*="stream-analytics"]').remove();
    }
  }
});
