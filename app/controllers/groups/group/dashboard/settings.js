import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  hoveredField: 'name',
  privacyOptions: ['open', 'closed', 'restricted'],
  store: service(),
  group: alias('model.group'),

  categories: computed('model.categories', function() {
    return get(this, 'model.categories').map(category => (
      { id: get(category, 'id'),
        name: get(category, 'name'),
        slug: get(category, 'slug')
      }
    ));
  }).readOnly(),

  searchGroupsTask: task(function* (query) {
    yield timeout(250);
    return yield get(this, 'store').query('group', {
      filter: { query }
    });
  }).restartable(),

  actions: {
    selectCategory(category) {
      set(this, 'selectedCategory', category);
      set(this, 'group.category', get(this, 'store').peekRecord('group-category', get(category, 'id')));
    },

    addNeighbor(group) {

    }
  }
});
