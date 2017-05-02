import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { alias } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  ajax: service(),
  store: service(),
  activity: alias('getAnnouncementsTask.last.value'),
  announcement: alias('activity.subject'),

  init() {
    this._super(...arguments);
    get(this, 'getAnnouncementsTask').perform();
  },

  /**
   * Returns the latest SiteAnnouncement. Currently this is built to only support one
   * announcement at a time (the most recent one). Eventually this will be switched out to
   * support multiple and only querying for announcements the user hasn't read.
   */
  getAnnouncementsTask: task(function* () {
    const activityGroup = yield get(this, 'store').query('feed', {
      type: 'site_announcements',
      id: get(this, 'session.account.id'),
      include: 'subject',
      page: { limit: 1 }
    });
    if (!activityGroup || get(activityGroup, 'isRead')) {
      return null;
    }
    return get(activityGroup, 'activities.firstObject');
  }).drop(),

  actions: {
    dismissAnnouncement() {
      set(this, 'activity.isRead', true);
      const userId = get(this, 'session.account.id');
      const readUrl = `/feeds/site_announcements/${userId}/_read`;
      get(this, 'ajax').request(readUrl, {
        method: 'POST',
        data: get(this, 'activity.streamId'),
        contentType: 'application/json'
      }).catch((error) => {
        set(this, 'activity.isRead', false);
        get(this, 'raven').captureException(error);
      });
    }
  }
});
