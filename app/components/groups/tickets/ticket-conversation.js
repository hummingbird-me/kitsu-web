import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  activeTab: 'message',
  showNav: true,
  store: service(),

  postMessageTask: task(function* () {
    // if the ticket is new then save that first
    if (get(this, 'isNewTicket')) {
      yield get(this, 'ticket').save();
    }
    const kind = get(this, 'activeTab') === 'message' ? 'message' : 'mod_note';
    const message = get(this, 'store').createRecord('group-ticket-message', {
      ticket: get(this, 'ticket'),
      user: get(this, 'session.account'),
      content: get(this, 'replyContent'),
      kind
    });
    yield message.save().then(() => {
      if (get(this, 'isNewTicket')) {
        this.$('.modal').modal('hide');
      }
    }).catch(() => {});
  }),

  updateStatusTask: task(function* (status) {
    set(this, 'ticket.status', status);
    yield get(this, 'ticket').save();
  }),

  actions: {
    markResolved() {
      if (get(this, 'updateStatusTask.isRunning')) { return; }
      get(this, 'updateStatusTask').perform('resolved');
    },

    markClosed() {
      if (get(this, 'updateStatusTask.isRunning')) { return; }
      get(this, 'updateStatusTask').perform('closed');
    }
  }
});
