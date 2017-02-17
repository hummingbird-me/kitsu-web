import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import Config from 'client/config/environment';
import canUseDOM from 'client/utils/can-use-dom';

export default BaseAdapter.extend({
  router: service('-routing'),

  toStringExtension() {
    return 'Stream';
  },

  init() {
    const environment = Config.APP.isStaging ? 'staging' : Config.environment;
    const config = get(this, `config.${environment}`);
    if (canUseDOM) {
      const client = new window.StreamAnalytics(config);
      set(this, 'client', client);
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
    if (canUseDOM && get(this, 'hasUser')) {
      const options = Object.assign({
        location: get(this, 'router.currentRouteName')
      }, data);
      get(this, 'client').trackImpression(options);
    }
  },

  trackEngagement(data) {
    if (canUseDOM && get(this, 'hasUser')) {
      const options = Object.assign({
        location: get(this, 'router.currentRouteName')
      }, data);
      get(this, 'client').trackEngagement(options);
    }
  }
});
