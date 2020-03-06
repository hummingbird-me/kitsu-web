import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isPresent } from '@ember/utils';
import Pagination from 'kitsu-shared/mixins/pagination';
import errorMessages from 'client/utils/error-messages';
import { unshiftObjects } from 'client/utils/array-utils';
import { concat } from 'client/utils/computed-macros';

/**
 * Refactor each notification item into its own individual component similar to
 * the stream setup.
 */
export default Component.extend(Pagination, {
  router: service(),
  ajax: service(),
  notify: service(),
  store: service(),
  streamRealtime: service(),
  notifications: concat('groups', 'paginatedRecords'),

  /**
   * Count notifications that are unseen.
   */
  count: computed('notifications.@each.isSeen', function() {
    const notifications = get(this, 'notifications');
    if (notifications === undefined) {
      return 0;
    }
    return notifications.reduce((prev, curr) => (prev + (get(curr, 'isSeen') ? 0 : 1)), 0);
  }),

  hasUnread: computed('notifications.@each.isRead', function() {
    const notifications = get(this, 'notifications');
    if (notifications === undefined || notifications.length === 0) {
      return false;
    }
    return notifications.some(curr => (!get(curr, 'isRead')));
  }),

  getNotifications: task(function* (limit = 15) {
    return yield this.queryPaginated('feed', {
      type: 'notifications',
      id: get(this, 'session.account.id'),
      include: 'actor,subject,target.user,target.post,target.anime,target.manga',
      page: { limit }
    }, { cache: false });
  }).enqueue(),

  init() {
    this._super(...arguments);
    set(this, 'groups', []);
    get(this, 'getNotifications').perform().then(groups => {
      const notifications = this._createTempNotifications(groups);
      get(this, 'groups').addObjects(notifications);
      // initialize realtime
      this._initializeRealtime(get(groups, 'meta.readonlyToken'));
    }).catch(() => {
      get(this, 'notify').error('There was an issue retrieving your Notifications.');
    });
  },

  didInsertElement() {
    this._super(...arguments);
    this.$().on('show.bs.dropdown', () => {
      if (get(this, 'groups.length') === 0) {
        return;
      }
      const notifications = get(this, 'notifications').filter(group => get(group, 'isSeen') === false);
      if (get(notifications, 'length') > 0) {
        notifications.forEach(group => set(group, 'isSeen', true));
        this._mark('seen', notifications).catch(err => {
          notifications.forEach(group => set(group, 'isSeen', false));
          get(this, 'notify').error(errorMessages(err));
        });
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$().off('show.bs.dropdown');
    const subscription = get(this, 'subscription');
    if (subscription !== undefined) {
      subscription.cancel();
    }
  },

  onPagination(records) {
    const notifications = this._createTempNotifications(records);
    this._super(notifications);
  },

  /**
   * create temporary local notification records so feed groups don't update our activity list
   *
   * @param {Array} groups
   */
  _createTempNotifications(groups) {
    const notifications = [];
    if (!groups) { return notifications; }
    groups.forEach(group => {
      const notification = get(this, 'store').createRecord('notification', {
        streamId: get(group, 'id'),
        group: get(group, 'group'),
        isSeen: get(group, 'isSeen'),
        isRead: get(group, 'isRead'),
        activities: get(group, 'activities').toArray()
      });
      set(notification, 'id', guidFor(notification));
      notifications.addObject(notification);
    });
    return notifications;
  },

  /**
   * Initialize the real time connection with Stream.
   *
   * @param {String} read only feed token
   */
  _initializeRealtime(token) {
    const id = get(this, 'session.account.id');
    const subscription = get(this, 'streamRealtime')
      .subscribe('notifications', id, token, object => this._handleRealtime(object));
    set(this, 'subscription', subscription);
  },

  /**
   * Handle realtime data incoming from Stream.
   *
   * @param {Object} object
   */
  _handleRealtime(object) {
    // new activities
    if (isPresent(get(object, 'new'))) {
      get(this, 'getNotifications').perform(get(object, 'new.length')).then(groups => {
        // remove duplicate records
        groups.forEach(group => {
          const record = get(this, 'notifications').findBy('group', get(group, 'group'));
          if (isPresent(record)) {
            get(this, 'groups').removeObject(record);
            get(this, 'paginatedRecords').removeObject(record);
          }
        });
        const notifications = this._createTempNotifications(groups);
        unshiftObjects(get(this, 'groups'), notifications);
        notifications.forEach(notification => {
          const actor = get(notification, 'activities.firstObject.actor.name');
          const message = `You have a new notification from ${actor}`;
          get(this, 'notify').info(message);
        });
      }).catch(() => {});
    }

    // deleted activities
    get(object, 'deleted').forEach(id => {
      const groups = get(this, 'notifications');
      const group = groups.find(g => get(g, 'activities').findBy('id', id) !== undefined);
      if (group !== undefined) {
        const activities = get(group, 'activities').reject(activity => get(activity, 'id') === id);
        set(group, 'activities', activities);
        if (get(group, 'activities.length') === 0) {
          get(this, 'groups').removeObject(group);
          get(this, 'paginatedRecords').removeObject(group);
        }
      }
    });
  },

  /**
   * Mark a list of notifications as `type` (either seen/read)
   *
   * @param {String} type
   * @param {Array} data
   * @returns
   */
  _mark(type, data) {
    const feedUrl = `/feeds/notifications/${get(this, 'session.account.id')}/_${type}`;
    return get(this, 'ajax').request(feedUrl, {
      method: 'POST',
      data: JSON.stringify(data.map(group => get(group, 'streamId'))),
      contentType: 'application/json'
    });
  },

  actions: {
    onPagination() {
      return this._super('feed', {
        type: 'notifications',
        id: get(this, 'session.account.id')
      });
    },

    markRead() {
      if (get(this, 'groups.length') === 0) {
        return;
      }
      const notifications = get(this, 'notifications').filter(group => get(group, 'isRead') === false);
      if (get(notifications, 'length') > 0) {
        notifications.forEach(group => set(group, 'isRead', true));
        this._mark('read', notifications).catch(err => {
          notifications.forEach(group => set(group, 'isRead', false));
          get(this, 'notify').error(errorMessages(err));
        });
      }
    }
  }
});
