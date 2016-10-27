import Component from 'ember-component';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['stream-item-comments'],

  actions: {
    createComment(content) {
      this.$('.add-comment').val('');
      invokeAction(this, 'onCreate', content);
    }
  }
});
