import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { scheduleOnce } from 'ember-runloop';
import { task } from 'ember-concurrency';
/* global autosize */

export default Component.extend({
  activeTab: 'message',
  store: service(),

  didInsertElement() {
    this._super(...arguments);
    this.$('.modal').on('shown.bs.modal', () => {
      this._scrollToBottom();
      this.$('.modal').off('shown.bs.modal');
    });
  },

  postMessageTask: task(function* () {
    const content = get(this, 'replyContent');
    if (isEmpty(content)) { return; }

    // if the ticket is new then save that first
    if (get(this, 'isNewTicket')) {
      yield get(this, 'ticket').save();
    }
    const kind = get(this, 'activeTab') === 'message' ? 'message' : 'mod_note';
    const message = get(this, 'store').createRecord('group-ticket-message', {
      ticket: get(this, 'ticket'),
      user: get(this, 'session.account'),
      content,
      kind
    });
    yield message.save().then(() => {
      if (get(this, 'isNewTicket')) {
        this.$('.modal').modal('hide');
      }
      set(this, 'replyContent', '');
      scheduleOnce('afterRender', () => {
        this._scrollToBottom();
        autosize.update(get(this, 'element').getElementsByClassName('ticket-input'));
      });
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
  },

  _scrollToBottom() {
    const [element] = get(this, 'element').getElementsByClassName('ticket-history');
    this.$(element).animate({
      scrollTop: (element.scrollHeight - element.clientHeight)
    }, 1000);
  }
});
