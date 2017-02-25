import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  classNames: ['group-neighbors-widget'],

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getNeighborsTask').perform();
  },

  getNeighborsTask: task(function* () {
    return yield get(this, 'store').query('group-neighbor', {
      include: 'destination',
      filter: { source: get(this, 'group.id') }
    });
  }).restartable()
});
