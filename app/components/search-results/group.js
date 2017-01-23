import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { typeOf } from 'ember-utils';
import { invokeAction } from 'ember-invoke-action';
import { modelType } from 'client/helpers/model-type';

export default Component.extend({
  router: service('-routing'),

  actions: {
    transitionTo(item) {
      invokeAction(this, 'close');
      if (typeOf(item) === 'string') {
        get(this, 'router.router').transitionTo(item);
      } else {
        const type = modelType([item]);
        if (type === 'user') {
          get(this, 'router').transitionTo('users.index', [get(item, 'name')]);
        } else {
          get(this, 'router').transitionTo(`${type}.show`, [get(item, 'slug')]);
        }
      }
    },

    noop() { }
  }
});
