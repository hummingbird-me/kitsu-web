import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { invokeAction } from 'ember-invoke-action';
import { storageFor } from 'ember-local-storage';

export default Component.extend({
  ratings: storageFor('onboarding-ratings'),

  rating: computed('item', 'ratings.[]', {
    get() {
      const cache = get(this, 'ratings').find(obj => (
        obj.id === get(this, 'item.id') && obj.type === get(this, 'item.modelType')
      ));
      return cache !== undefined ? cache.rating : 0;
    }
  }).readOnly(),

  actions: {
    onClick(rating) {
      get(this, 'ratings').addObject({
        type: get(this, 'item.modelType'),
        id: get(this, 'item.id'),
        rating
      });
      invokeAction(this, 'onClick', rating);
    }
  }
});
