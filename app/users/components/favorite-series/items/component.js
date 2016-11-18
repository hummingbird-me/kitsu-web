import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import getter from 'client/utils/getter';

export default Component.extend({
  isCharacter: getter(function() {
    return get(this, 'type') === 'character';
  }),

  actions: {
    updateNextPage(...args) {
      invokeAction(this, 'updateNextPage', ...args);
    }
  }
});
