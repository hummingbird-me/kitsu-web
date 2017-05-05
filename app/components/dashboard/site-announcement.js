import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  ajax: service(),
  store: service(),
  stream: service('stream-realtime'),

  activityGroup: alias('getAnnouncementsTask.last.value.firstObject'),
  activity: alias('activityGroup.activities.firstObject'),
  announcement: alias('activity.subject'),

  showAnnouncement: computed('activity', 'activityGroup.{isRead,isDeleted}', function() {
    const activityGroup = get(this, 'activityGroup');
    return !!(get(this, 'activity') && !get(activityGroup, 'isRead') &&
      !get(activityGroup, 'isDeleted'));
  }).readOnly(),

  init() {
    this._super(...arguments);
    get(this, 'getAnnouncementsTask').perform().then((records) => {
      // setup websocket connection to GetStream
      const userId = get(this, 'session.account.id');
      const { readonlyToken: token } = get(records, 'meta');
      const callback = (data) => { this._handleSubscription(data); };
      this.realtime = get(this, 'stream').subscribe('site_announcements', userId, token, callback);
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.realtime) {
      this.realtime.cancel();
    }
  },

  /**
   * Returns the latest SiteAnnouncement. Currently this is built to only support one
   * announcement at a time (the most recent one). Eventually this will be switched out to
   * support multiple and only querying for announcements the user hasn't read.
   *
   * @param {Object} options Request options
   */
  getAnnouncementsTask: task(function* (options = {}) {
    const requestOptions = Object.assign({
      type: 'site_announcements',
      id: get(this, 'session.account.id'),
      include: 'subject',
      page: { limit: 1 }
    }, options);
    return yield get(this, 'store').query('feed', requestOptions);
  }).drop(),

  actions: {
    /**
     * Mark an announcement activity as read for the users announcement feed.
     */
    dismissAnnouncement() {
      set(this, 'activityGroup.isRead', true);
      const userId = get(this, 'session.account.id');
      const activityId = get(this, 'activityGroup.id');
      const readUrl = `/feeds/site_announcements/${userId}/_read`;
      get(this, 'ajax').request(readUrl, {
        method: 'POST',
        data: JSON.stringify([activityId]),
        contentType: 'application/json'
      }).catch((error) => {
        set(this, 'activityGroup.isRead', false);
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
    // Check if our announcement has been deleted
    const isDeleted = deleted.any(id => id === get(this, 'activityGroup.id'));
    if (isDeleted) {
      get(this, 'activityGroup').deleteRecord();
    }
    // Since this is a direct connection to GetStream, the data is raw so we have to request the
    // API to enrich the data.
    if (created.length > 0) {
      get(this, 'getAnnouncementsTask').perform({
        page: { limit: 1 }
      });
    }
  }
});
