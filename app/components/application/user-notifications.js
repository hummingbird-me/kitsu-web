import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { task } from 'ember-concurrency';
import { prependObjects } from 'client/utils/array-utils';
import moment from 'moment';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  ajax: service(),
  notify: service(),
  session: service(),
  store: service(),
  streamRealtime: service(),

  count: computed('groups.@each.isSeen', {
    get() {
      const groups = get(this, 'groups');
      if (groups === undefined) {
        return 0;
      }
      return groups.reduce((prev, curr) => (prev + (get(curr, 'isSeen') ? 0 : 1)), 0);
    }
  }),

  /**
   * set the activities to an array so any updates to a group from a feed load
   * won't reset the activities relationship
   */
  getNotifications: task(function* () {
    return yield get(this, 'store').query('feed', {
      type: 'notifications',
      id: get(this, 'session.account.id'),
      include: 'actor'
    }).then((groups) => {
      const meta = get(groups, 'meta');
      groups.forEach(group => set(group, 'activities', get(group, 'activities').toArray()));
      set(this, 'groups', groups);
      set(this, 'groups.meta', meta);
      return get(this, 'groups');
    });
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'groups', []);
    get(this, 'getNotifications').perform().then((data) => {
      const { readonlyToken } = get(data, 'meta');
      const id = get(this, 'session.account.id');
      const subscription = get(this, 'streamRealtime')
        .subscribe('notifications', id, readonlyToken, object => this._handleRealtime(object));
      set(this, 'subscription', subscription);
    }).catch(() => {});
  },

  willDestroyElement() {
    this._super(...arguments);
    const subscription = get(this, 'subscription');
    if (subscription !== undefined) {
      subscription.cancel();
    }
  },

  _handleRealtime(object) {
    const groups = get(this, 'groups');

    // new activities
    get(object, 'new').forEach((activity) => {
      const enriched = this._enrichActivity(activity);
      const group = groups.findBy('group', get(activity, 'group'));
      if (group !== undefined) {
        prependObjects(get(group, 'activities'), [enriched]);
        set(group, 'isSeen', false);
        set(group, 'isRead', false);
        groups.removeObject(group);
        prependObjects(groups, [group]);
      } else {
        const newGroup = get(this, 'store').createRecord('activity-group', {
          activities: [enriched]
        });
        prependObjects(groups, [newGroup]);
      }
    });

    // deleted activities
    get(object, 'deleted').forEach((id) => {
      const group = groups.find(g => get(g, 'activities').findBy('id', id) !== undefined);
      if (group !== undefined) {
        const activities = get(group, 'activities').reject(activity => get(activity, 'id') === id);
        set(group, 'activities', activities);
        if (get(group, 'activities.length') === 0) {
          get(this, 'groups').removeObject(group);
        }
      }
    });

    // TODO: Toast user
  },

  _enrichActivity(activity) {
    const enriched = get(this, 'store').createRecord('activity', {
      id: get(activity, 'id'),
      foreignId: get(activity, 'foreign_id'),
      time: moment.parseZone(get(activity, 'time')).local().format(),
      verb: get(activity, 'verb')
    });
    get(this, 'store').findRecord('user', get(activity, 'actor').split(':')[1]).then((user) => {
      set(enriched, 'actor', user);
    });
    return enriched;
  },

  _mark(type, data) {
    const feedUrl = `/feeds/notifications/${get(this, 'session.account.id')}/_${type}`;
    return get(this, 'ajax').request(feedUrl, {
      method: 'POST',
      data: JSON.stringify(data.map(group => get(group, 'id'))),
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
    }
  }
});
