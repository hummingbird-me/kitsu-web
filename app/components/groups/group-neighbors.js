import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { filterBy } from 'ember-computed';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';

export default Component.extend({
  store: service(),
  classNames: ['group-neighbors-widget'],
  neighbors: concat('getNeighborsTask.last.value', 'addedNeighbors'),
  filteredNeighbors: filterBy('neighbors', 'isDeleted', false),

  init() {
    this._super(...arguments);
    set(this, 'addedNeighbors', []);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getNeighborsTask').perform();
  },

  getNeighborsTask: task(function* () {
    return yield get(this, 'store').query('group-neighbor', {
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
