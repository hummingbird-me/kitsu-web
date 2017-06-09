import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { bool } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  store: service(),
  isFavorited: bool('_favoriteRecord'),

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, '_favoriteRecord', null);
    if (get(this, 'session.hasUser')) {
      get(this, 'getFavoriteTask').perform();
    }
  },

  getFavoriteTask: task(function* () {
    const record = yield get(this, 'store').query('category-favorite', {
      filter: {
        user_id: get(this, 'session.account.id'),
        category_id: get(this, 'category.id')
      }
    }).then(records => get(records, 'firstObject'));
    set(this, '_favoriteRecord', record);
  }).drop(),

  createFavoriteTask: task(function* () {
    if (get(this, 'getFavoriteTask.isRunning')) { return; }
    const record = get(this, 'store').createRecord('category-favorite', {
      user: get(this, 'session.account'),
      category: get(this, 'category')
    });
    yield record.save();
    set(this, '_favoriteRecord', record);
  }).drop(),

  destroyFavoriteTask: task(function* () {
    if (get(this, 'getFavoriteTask.isRunning')) { return; }
    const record = get(this, '_favoriteRecord');
    yield record.destroyRecord();
    set(this, '_favoriteRecord', null);
  }).drop()
});
