import Ember from 'ember';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { typeOf } from 'ember-utils';
import { modelType } from 'client/helpers/model-type';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import { invokeAction } from 'ember-invoke-action';

export default Ember.Component.extend({
  router: service('-routing'),

  link: computed('item', {
    get() {
      const item = get(this, 'item');
      if (typeOf(item) === 'string') {
        return item;
      }

      const type = modelType([item]);
      if (type === 'user') {
        return hrefTo(this, 'users.index', get(item, 'id'));
      }
      return hrefTo(this, `${type}.show`, get(item, 'id'));
    }
  }),

  actions: {
    transitionTo(link) {
      invokeAction(this, 'close');
      get(this, 'router.router').transitionTo(link);
    }
  }
});
