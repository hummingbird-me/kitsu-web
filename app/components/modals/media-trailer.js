import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Component.extend({
  metrics: service(),
  session: service(),

  actions: {
    playVideo() {
      get(this, 'metrics').trackEvent({
        category: 'trailer',
        action: 'play',
        label: get(this, 'media.modelType'),
        value: get(this, 'media.id')
      });
    }
  }
});
