import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import getter from 'client/utils/getter';
import { modelType } from 'client/helpers/model-type';

export default Component.extend({
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
    // reset the count if transitioning between users
    if (get(this, 'userIdWas') !== get(this, 'user.id')) {
      set(this, 'showCount', get(this, 'count'));
    } else {
      set(this, 'showCount', this._getCount());
    }
    set(this, 'userIdWas', get(this, 'user.id'));
  },

  _getCount() {
    if (get(this, 'showCount') < get(this, 'items.length')) {
      const value = get(this, 'showCount') + get(this, 'count');
      if (value > get(this, 'items.length')) {
        return get(this, 'showCount') + (get(this, 'items.length') - get(this, 'showCount'));
      }
      return value;
    }
    return get(this, 'showCount');
  },

  actions: {
    showMore() {
      set(this, 'showCount', this._getCount());
    }
  }
});
