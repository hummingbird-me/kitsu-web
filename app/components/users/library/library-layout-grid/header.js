import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { strictInvokeAction } from 'ember-invoke-action';

export default Component.extend({
  limitOptions: [25, 50, 100, 200],
  sortingOptions: [{
    key: '-updated_at',
    value: 'Date Watched: Recent First'
  }, {
    key: 'updated_at',
    value: 'Date Watched: Oldest First'
  }, {
    key: '-rating',
    value: 'Rating: High to Low'
  }, {
    key: 'rating',
    value: 'Rating: Low to High'
  }/* , {
    key: 'media.episodeCount',
    value: 'Length: Shortest First'
  }, {
    key: '-media.episodeCount',
    value: 'Length: Longest First'
  }*/],

  init() {
    this._super(...arguments);
    set(this, 'selectedSort', get(this, 'sortingOptions.firstObject'));
  },

  actions: {
    updateSort(sortObj) {
      set(this, 'selectedSort', sortObj);
      strictInvokeAction(this, 'onSortChange', sortObj.key);
    }
  }
});
