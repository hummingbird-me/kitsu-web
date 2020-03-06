import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { scheduleOnce } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';
import errorMessages from 'client/utils/error-messages';
import Pagination from 'kitsu-shared/mixins/pagination';
/* global autosize */

export default Component.extend(Pagination, {
  activeTab: 'message',
  notify: service(),
  store: service(),
  messages: concat('paginatedRecords', 'getMessagesTask.last.value', 'newMessages'),

  init() {
    this._super(...arguments);
    set(this, 'newMessages', []);
    get(this, 'getMessagesTask').perform().then(() => {
      scheduleOnce('afterRender', () => {
        this._scrollToBottom();
      });
    }).catch(() => {});
  },

  onPagination(records) {
    this._super(records.toArray().reverse());
  },

  getMessagesTask: task(function* () {
    return yield this.queryPaginated('group-ticket-message', {
      filter: { ticket: get(this, 'ticket.id') },
      include: 'user',
      sort: '-created_at'
    }).then(records => records.toArray().reverse());
  }),

  postMessageTask: task(function* () {
    const content = get(this, 'replyContent');
    if (isEmpty(content)) { return; }

    // if the ticket is new then save that first
    if (get(this, 'isNewTicket')) {
      yield get(this, 'ticket').save().catch(error => {
        get(this, 'notify').error(errorMessages(error));
        throw error;
      });
    }
    const kind = get(this, 'activeTab') === 'message' ? 'message' : 'mod_note';
    const message = get(this, 'store').createRecord('group-ticket-message', {
      ticket: get(this, 'ticket'),
      user: get(this, 'session.account'),
      content,
      kind
    });
    yield message.save().then(() => {
      get(this, 'newMessages').addObject(message);
      set(this, 'replyContent', '');
      scheduleOnce('afterRender', () => {
        this._scrollToBottom();
        autosize.update(get(this, 'element').getElementsByClassName('ticket-input'));
      });
      invokeAction(this, 'onCreate', get(this, 'ticket'));
    }).catch(error => {
      get(this, 'notify').error(errorMessages(error));
    });
  }),

  updateStatusTask: task(function* (status) {
    set(this, 'ticket.status', status);
    yield get(this, 'ticket').save().catch(error => {
      get(this, 'notify').error(errorMessages(error));
    });
  }),

  actions: {
    markResolved() {
      if (get(this, 'updateStatusTask.isRunning')) { return; }
      get(this, 'updateStatusTask').perform('resolved');
    },

    markOpen() {
      if (get(this, 'updateStatusTask.isRunning')) { return; }
      get(this, 'updateStatusTask').perform('created');
    },

    onEnter(component, event) {
      const { metaKey, ctrlKey } = event;
      if (metaKey === true || ctrlKey === true) {
        get(this, 'postMessageTask').perform();
      }
    }
  },

  _scrollToBottom() {
    const element = get(this, 'element').getElementsByClassName('ticket-history')[0];
    this.$(element).animate({
      scrollTop: (element.scrollHeight - element.clientHeight)
    }, 1000);
  }
});
