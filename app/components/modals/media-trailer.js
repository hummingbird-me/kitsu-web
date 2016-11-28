import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { modelType } from 'client/helpers/model-type';

export default Component.extend({
  metrics: service(),
  session: service(),

  actions: {
    playVideo() {
      get(this, 'metrics').trackEvent({
        category: 'trailer',
        action: 'play',
        label: modelType([get(this, 'media')]),
        value: get(this, 'media.id')
      });
    }
  }
});
