import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { invokeAction } from 'ember-invoke-action';
import { modelType } from 'client/helpers/model-type';
import { storageFor } from 'ember-local-storage';

export default Component.extend({
  ratings: storageFor('onboarding-ratings'),

  rating: computed('item', 'ratings.[]', {
    get() {
      const cache = get(this, 'ratings').find(obj => (
        obj.id === get(this, 'item.id') && obj.type === modelType([get(this, 'item')])
      ));
      return cache !== undefined ? cache.rating : 0;
    }
  }).readOnly(),

  actions: {
    onClick(rating) {
      get(this, 'ratings').addObject({
        type: modelType([get(this, 'item')]),
        id: get(this, 'item.id'),
        rating
      });
      invokeAction(this, 'onClick', rating);
    }
  }
});
