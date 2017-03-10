import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { isEmpty } from 'ember-utils';
import { scheduleOnce } from 'ember-runloop';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';
/* global autosize */

export default Component.extend(Pagination, {
  store: service(),
  messages: concat('paginatedRecords', 'getChatMessagesTask.last.value', 'newMessages'),

  canPost: computed('messageContent', 'postMessageTask.isIdle', function() {
    return get(this, 'messageContent') && get(this, 'postMessageTask.isIdle');
  }).readOnly(),

  init() {
    this._super(...arguments);
    set(this, 'newMessages', []);
    get(this, 'getChatMessagesTask').perform().then(() => {
      scheduleOnce('afterRender', () => {
        this._scrollToBottom();
      });
    }).catch(() => {});
  },

  onPagination(records) {
    this._super(records.toArray().reverse());
  },

  getChatMessagesTask: task(function* () {
    return yield get(this, 'store').query('leader-chat-message', {
      filter: { group_id: get(this, 'group.id') },
      include: 'user',
      sort: '-created_at'
    }).then((records) => {
      this.updatePageState(records);
      return records.toArray().reverse();
    });
  }),

  postMessageTask: task(function* () {
    const content = get(this, 'messageContent');
    if (isEmpty(content)) { return; }
    const message = get(this, 'store').createRecord('leader-chat-message', {
      content,
      group: get(this, 'group'),
      user: get(this, 'session.account')
    });
    yield message.save().then(() => {
      get(this, 'newMessages').addObject(message);
      set(this, 'messageContent', '');
      scheduleOnce('afterRender', () => {
        this._scrollToBottom();
        autosize.update(get(this, 'element').getElementsByClassName('leader-input'));
      });
    });
  }).drop(),

  actions: {
    onEnter(component, event) {
      const { metaKey, ctrlKey } = event;
      if (metaKey === true || ctrlKey === true) {
        get(this, 'postMessageTask').perform();
      }
    }
  },

  _scrollToBottom() {
    const [element] = get(this, 'element').getElementsByClassName('leader-chat-wrapper');
    element.scrollTop = (element.scrollHeight - element.clientHeight);
  }
});
