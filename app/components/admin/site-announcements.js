import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { and } from 'ember-computed';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  tagName: '',
  announcements: concat('getAnnouncementsTask.last.value', 'paginatedRecords'),
  canCreateAnnouncement: and('createAnnouncementTask.isIdle', 'announcement.validations.isValid'),

  init() {
    this._super(...arguments);
    const announcement = this._createAnnouncement();
    set(this, 'announcement', announcement);
    get(this, 'getAnnouncementsTask').perform();
  },

  getAnnouncementsTask: task(function* () {
    return yield this.queryPaginated('site-announcement', { include: 'user' });
  }).drop(),

  createAnnouncementTask: task(function* () {
    return yield get(this, 'announcement').save().then(() => {
      const announcement = this._createAnnouncement();
      set(this, 'announcement', announcement);
    });
  }).drop(),

  deleteAnnouncementTask: task(function* (announcement) {
    return yield announcement.destroyRecord().catch(() => {
      announcement.rollbackAttributes();
    });
  }).drop(),

  _createAnnouncement() {
    return get(this, 'store').createRecord('site-announcement', {
      user: get(this, 'session.account')
    });
  }
});
