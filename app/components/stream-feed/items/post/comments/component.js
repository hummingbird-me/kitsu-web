import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['stream-item-comments'],
  session: service(),

  actions: {
    createComment(content) {
      if (get(this, 'readOnly') === true) {
        return get(this, 'session.signUpModal')();
      }

      this.$('.add-comment').val('');
      invokeAction(this, 'onCreate', content);
    }
  }
});
