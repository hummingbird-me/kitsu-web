import Controller from '@ember/controller';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, filterBy } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';
import RSVP from 'rsvp';

export default Controller.extend({
  hoveredField: 'tagline',
  intl: service(),
  notify: service(),
  store: service(),
  group: alias('model.group'),
  isDirty: filterBy('records', 'hasDirtyAttributes'),

  addedNeighbors: computed('_neighbors.[]', function() {
    return get(this, '_neighbors');
  }).readOnly(),

  neighborsDisabled: computed('addedNeighbors', function() {
    const addedNeighbors = get(this, 'addedNeighbors.length');
    const savedNeighbors = get(this, 'savedNeighbors.length');
    return (addedNeighbors + savedNeighbors) === 4;
  }).readOnly(),

  categories: computed('model.categories', function() {
    return get(this, 'model.categories').map(category => (
      {
        id: get(category, 'id'),
        name: get(category, 'name'),
        slug: get(category, 'slug')
      }
    ));
  }).readOnly(),

  isValid: computed('group.validations.isValid', 'isDirty', 'saveRecordsTask.isRunning', function() {
    return get(this, 'group.validations.isValid')
      && get(this, 'isDirty.length') && !get(this, 'saveRecordsTask.isRunning');
  }).readOnly(),

  searchGroupsTask: task(function* (query) {
    yield timeout(250);
    return yield get(this, 'store').query('group', {
      filter: { query, privacy: 'open,restricted' }
    });
  }).restartable(),

  saveRecordsTask: task(function* () {
    set(this, 'errorMessage', null);
    const records = get(this, 'records');
    const saving = records.filterBy('hasDirtyAttributes').map(record => record.save());
    return yield new RSVP.Promise((resolve, reject) => {
      RSVP.allSettled(saving).then(data => {
        const failed = data.filterBy('state', 'rejected');
        return failed.length > 0 ? reject(failed) : resolve();
      });
    }).catch(error => {
      set(this, 'errorMessage', errorMessages(error));
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

      // is this our group?
      const ours = get(this, 'group.id') === get(group, 'id');
      if (ours) {
        get(this, 'notify').error(get(this, 'intl').t('groups.create.form.errors.neighbors-same'));
        return;
      }

      // does this group exist in our added neighbors?
      const added = get(this, 'addedNeighbors').find(addedNeighbor => (
        get(addedNeighbor, 'destination.id') === get(group, 'id')
      ));

      // does this group already exist in saved neighbors?
      const saved = get(this, 'savedNeighbors').find(savedNeighbor => (
        get(savedNeighbor, 'destination.id') === get(group, 'id')
      ));

      if (!saved && !added) {
        get(this, '_neighbors').addObject(neighbor);
        get(this, 'records').addObject(neighbor);
      }
    },

    removeNeighbor(neighbor) {
      neighbor.deleteRecord();
      get(this, 'records').addObject(neighbor);
      get(this, '_neighbors').removeObject(neighbor);
    }
  }
});
