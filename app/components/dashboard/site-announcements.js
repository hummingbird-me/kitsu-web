import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { mapBy } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  ajax: service(),
  raven: service(),
  store: service(),
  stream: service('stream-realtime'),
  announcements: mapBy('activities', 'subject'),

  activities: computed('activityGroups.[]', function() {
    return (get(this, 'activityGroups') || []).mapBy('activities.firstObject');
  }).readOnly(),

  init() {
    this._super(...arguments);
    get(this, 'getAnnouncementsTask').perform().then(records => {
      // filter out read activity groups
      const groups = records.reject(record => get(record, 'isRead'));
      set(this, 'activityGroups', groups || []);

      // setup websocket connection to GetStream
      const { feed } = get(records, 'meta');
      if (feed) {
        const { group, id, token } = feed;
        this.realtime = get(this, 'stream').subscribe(group, id, token, data => {
          this._handleSubscription(data);
        });
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.realtime) {
      this.realtime.cancel();
    }
  },

  /**
   * Gets the latest Site Announcements from the Stream feed.
   *
   * @param {Object} options Request options
   */
  getAnnouncementsTask: task(function* (options = {}) {
    const requestOptions = { type: 'site_announcements',
      id: get(this, 'session.account.id'),
      include: 'subject',
      ...options };
    return yield get(this, 'store').query('feed', requestOptions);
  }).drop(),

  actions: {
    /**
     * Mark an announcement activity as read for the user.
     */
    dismissAnnouncement() {
      const announcement = get(this, 'announcements').shiftObject();
      const userId = get(this, 'session.account.id');
      const activity = get(this, 'activities').findBy('subject.id', get(announcement, 'id'));
      const readUrl = `/feeds/site_announcements/${userId}/_read`;
      get(this, 'ajax').request(readUrl, {
        method: 'POST',
        data: JSON.stringify([get(activity, 'id')]),
        contentType: 'application/json'
      }).catch(error => {
        get(this, 'announcements').unshiftObject(announcement);
        get(this, 'raven').captureException(error);
      });
    }
  },

  /**
   * Handle the incoming data from the GetStream websocket connection.
   *
   * @param {Object} data GetStream websocket response
   */
  _handleSubscription(data) {
    const { new: created, deleted } = data;
    // Handle deleted announcements by removing them from the stack
    if (deleted.length > 0) {
      deleted.forEach(activityId => {
        const activity = get(this, 'activities').findBy('id', activityId);
        get(this, 'announcements').removeObject(get(activity, 'subject'));
      });
    }
    // Since this is a direct connection to GetStream, the data is raw so we have to request the
    // API to enrich the data.
    if (created.length > 0) {
      get(this, 'getAnnouncementsTask').perform({
        page: { limit: created.length }
      }).then(records => {
        const groups = records.reject(record => get(record, 'isRead'));
        get(this, 'activityGroups').unshiftObjects(groups);
      });
    }
  }
});
