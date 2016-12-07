import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { guidFor } from 'ember-metal/utils';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { task } from 'ember-concurrency';
import { prependObjects } from 'client/utils/array-utils';
import { isPresent } from 'ember-utils';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  router: service('-routing'),
  ajax: service(),
  notify: service(),
  session: service(),
  store: service(),
  streamRealtime: service(),

  /**
   * Count notifications that are unseen.
   */
  count: computed('groups.@each.isSeen', {
    get() {
      const groups = get(this, 'groups');
      if (groups === undefined) {
        return 0;
      }
      return groups.reduce((prev, curr) => (prev + (get(curr, 'isSeen') ? 0 : 1)), 0);
    }
  }),

  hasUnread: computed('groups.@each.isRead', {
    get() {
      const groups = get(this, 'groups');
      if (groups === undefined || groups.length === 0) {
        return false;
      }

      return groups.some(curr => (!get(curr, 'isRead')));
    }
  }),

  getNotifications: task(function* (limit = 15) {
    return yield get(this, 'store').query('feed', {
      type: 'notifications',
      id: get(this, 'session.account.id'),
      include: 'actor,target.post',
      page: { limit }
    });
  }).enqueue(),

  init() {
    this._super(...arguments);
    set(this, 'groups', []);
    get(this, 'getNotifications').perform().then((groups) => {
      const notifications = this._createTempNotifications(groups);
      get(this, 'groups').addObjects(notifications);
      // initialize realtime
      this._initializeRealtime(get(groups, 'meta.readonlyToken'));
    }).catch(() => {
      get(this, 'notify').error('There was an issue retrieving your Notifications.');
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    const subscription = get(this, 'subscription');
    if (subscription !== undefined) {
      subscription.cancel();
    }
  },

  /**
   * create temporary local notification records so feed groups don't update our activity list
   *
   * @param {Array} groups
   */
  _createTempNotifications(groups) {
    const notifications = [];
    groups.forEach((group) => {
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
      get(this, 'getNotifications').perform(get(object, 'new.length')).then((groups) => {
        // remove duplicate records
        groups.forEach((group) => {
          const record = get(this, 'groups').findBy('group', get(group, 'group'));
          if (isPresent(record)) {
            get(this, 'groups').removeObject(record);
          }
        });
        const notifications = this._createTempNotifications(groups);
        prependObjects(get(this, 'groups'), notifications);
        notifications.forEach((notification) => {
          const actor = get(notification, 'activities.firstObject.actor.name');
          const message = `You have a new notification from ${actor}`;
          get(this, 'notify').info(message);
        });
      });
    }

    // deleted activities
    get(object, 'deleted').forEach((id) => {
      const groups = get(this, 'groups');
      const group = groups.find(g => get(g, 'activities').findBy('id', id) !== undefined);
      if (group !== undefined) {
        const activities = get(group, 'activities').reject(activity => get(activity, 'id') === id);
        set(group, 'activities', activities);
        if (get(group, 'activities.length') === 0) {
          get(this, 'groups').removeObject(group);
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
    markSeen() {
      if (get(this, 'groups.length') === 0) {
        return;
      }
      const groups = get(this, 'groups').filter(group => get(group, 'isSeen') === false);
      if (get(groups, 'length') > 0) {
        groups.forEach(group => set(group, 'isSeen', true));
        this._mark('seen', groups).catch((err) => {
          groups.forEach(group => set(group, 'isSeen', false));
          get(this, 'notify').error(errorMessages(err));
        });
      }
    },

    markRead() {
      if (get(this, 'groups.length') === 0) {
        return;
      }
      const groups = get(this, 'groups').filter(group => get(group, 'isRead') === false);
      if (get(groups, 'length') > 0) {
        groups.forEach(group => set(group, 'isRead', true));
        this._mark('read', groups).catch((err) => {
          groups.forEach(group => set(group, 'isRead', false));
          get(this, 'notify').error(errorMessages(err));
        });
      }
    },

    followNotification(group, target) {
      set(group, 'isRead', true);
      this._mark('read', [group]).catch((err) => {
        set(group, 'isRead', false);
        get(this, 'notify').error(errorMessages(err));
      });

      if (target === undefined || target === null) return;
      get(this, 'router').transitionTo(target.route, [target.model]);
    }
  }
});
