import Component from '@ember/component';
import { get, set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';

export default Component.extend({
  closeOnClick: true,
  isOpened: false,

  init() {
    this._super(...arguments);
    set(this, 'items', []);
  },

  request: task(function* (query) {
    return yield invokeAction(this, 'search', query);
  }).restartable(),

  actions: {
    update(value) {
      if (isEmpty(value) === true) {
        set(this, 'items', []);
      } else {
        get(this, 'request').perform(value).then(items => {
          set(this, 'items', items);
          set(this, 'isOpened', true);
        }).catch(() => {});
      }
    },

    close() {
      if (get(this, 'closeOnClick') === true) {
        set(this, 'isOpened', false);
      }
    }
  }
});
