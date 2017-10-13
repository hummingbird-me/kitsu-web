import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  metrics: service(),

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
