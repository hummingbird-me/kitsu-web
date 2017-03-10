import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed, { alias, filterBy } from 'ember-computed';
import { task, timeout } from 'ember-concurrency';
import RSVP from 'rsvp';

export default Controller.extend({
  records: [],
  hoveredField: 'tagline',
  store: service(),
  group: alias('model.group'),
  isDirty: filterBy('records', 'hasDirtyAttributes'),

  _neighbors: [],
  addedNeighbors: computed('_neighbors.[]', function() {
    return get(this, '_neighbors');
  }).readOnly(),

  categories: computed('model.categories', function() {
    return get(this, 'model.categories').map(category => (
      { id: get(category, 'id'),
        name: get(category, 'name'),
        slug: get(category, 'slug')
      }
    ));
  }).readOnly(),

  isValid: computed('group.validations.isValid', 'isDirty', 'saveRecordsTask.isRunning', function() {
    return get(this, 'group.validations.isValid') &&
      get(this, 'isDirty.length') && !get(this, 'saveRecordsTask.isRunning');
  }).readOnly(),

  searchGroupsTask: task(function* (query) {
    yield timeout(250);
    return yield get(this, 'store').query('group', {
      filter: { query, privacy: 'open,restricted' }
    });
  }).restartable(),

  saveRecordsTask: task(function* () {
    set(this, 'showError', false);
    const records = get(this, 'records');
    const saving = records.filterBy('hasDirtyAttributes').map(record => record.save());
    return yield new RSVP.Promise((resolve, reject) => {
      RSVP.allSettled(saving).then((data) => {
        const failed = data.filterBy('state', 'rejected');
        return failed.length > 0 ? reject(failed) : resolve();
      });
    }).catch(() => {
      set(this, 'showError', true);
    });
  }),

  actions: {
    selectCategory(category) {
      set(this, 'selectedCategory', category);
      const record = get(this, 'store').peekRecord('group-category', get(category, 'id'));
      set(this, 'group.category', record);
      set(this, 'group.categoryHack', true);
    },

    addNeighbor(group) {
      const neighbor = get(this, 'store').createRecord('group-neighbor', {
        source: get(this, 'group'),
        destination: group
      });
      get(this, '_neighbors').addObject(neighbor);
      get(this, 'records').addObject(neighbor);
    },

    removeNeighbor(neighbor) {
      neighbor.deleteRecord();
      get(this, 'records').addObject(neighbor);
      get(this, '_neighbors').removeObject(neighbor);
    }
  }
});
