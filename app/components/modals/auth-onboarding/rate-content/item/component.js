import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import stateFor from 'ember-state-services/state-for';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  init() {
    this._super(...arguments);
    const key = `${get(this, 'item').constructor.modelName}_${get(this, 'item.id')}`;
    set(this, 'data', stateFor(`CONTENT_ITEM_${key}`, 'item'));
  },

  actions: {
    onClick(rating) {
      set(this, 'data.rating', rating);
      invokeAction(this, 'onClick', rating);
    }
  }
});
