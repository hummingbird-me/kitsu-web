import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import getter from 'client/utils/getter';
import { modelType } from 'client/helpers/model-type';

export default Component.extend({
  showCount: 0,

  showableItems: computed('items.[]', 'showCount', {
    get() {
      return get(this, 'items').slice(0, get(this, 'showCount'));
    }
  }).readOnly(),

  type: getter(function() {
    const first = get(this, 'items.firstObject');
    return modelType([get(first, 'item')]);
  }),

  isCharacter: getter(function() {
    return get(this, 'type') === 'character';
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'showCount', get(this, 'showCount') + this._getCount());
  },

  _getCount() {
    const current = get(this, 'showCount');
    const chunk = get(this, 'count');
    const total = get(this, 'items.length');
    if ((total - current) < chunk) {
      return total - current;
    }
    return current + chunk;
  },

  actions: {
    showMore() {
      set(this, 'showCount', get(this, 'showCount') + this._getCount());
    }
  }
});
