import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';

export default Component.extend({
  isLeader: computed('messageClass', function() {
    const messageClass = get(this, 'messageClass');
    return messageClass === 'leader-message' || messageClass === 'mod-note';
  }).readOnly(),

  didReceiveAttrs() {
    this._super(...arguments);
    const kind = get(this, 'message.kind');
    if (kind === 'message') {
      const ticketAuthorId = get(this, 'ticket.user.id');
      if (ticketAuthorId !== get(this, 'message.user.id')) {
        set(this, 'messageClass', 'leader-message');
      } else {
        set(this, 'messageClass', 'other-message');
      }
    } else {
      set(this, 'messageClass', 'mod-note');
    }
  }
});
