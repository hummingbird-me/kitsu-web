import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  isSaved: computed('link', function() {
    return !get(this, 'link.isNew') && !get(this, 'link.isDeleted');
  }),

  actions: {
    update(content) {
      invokeAction(this, 'update', get(this, 'link'), content);
    },

    remove() {
      invokeAction(this, 'remove', get(this, 'link'));
    }
  }
});
