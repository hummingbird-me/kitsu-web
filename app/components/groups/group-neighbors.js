import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { filterBy } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';

export default Component.extend({
  classNames: ['group-neighbors-widget'],
  queryCache: service(),
  neighbors: concat('getNeighborsTask.last.value', '_addedNeighbors'),
  filteredNeighbors: filterBy('neighbors', 'isDeleted', false),

  init() {
    this._super(...arguments);
    set(this, '_addedNeighbors', get(this, 'addedNeighbors') || []);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'groupWas') !== get(this, 'group.id')) {
      get(this, 'getNeighborsTask').perform().then(records => {
        invokeAction(this, 'onLoad', records);
      }).catch(() => {});
      set(this, 'groupWas', get(this, 'group.id'));
    }
  },

  getNeighborsTask: task(function* () {
    return yield get(this, 'queryCache').query('group-neighbor', {
      include: 'destination',
      filter: { source: get(this, 'group.id') }
    });
  }).restartable(),

  actions: {
    onRemove(neighbor) {
      invokeAction(this, 'onRemove', neighbor);
    }
  }
});
