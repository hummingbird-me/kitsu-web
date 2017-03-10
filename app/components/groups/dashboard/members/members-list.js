import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task, taskGroup } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  intl: service(),
  notify: service(),
  members: concat('getMembersTask.last.value', 'paginatedRecords'),
  actionsTaskGroup: taskGroup(),

  init() {
    this._super(...arguments);
    get(this, 'getMembersTask').perform();
  },

  getMembersTask: task(function* () {
    const group = get(this, 'group.id');
    return yield get(this, 'store').query('group-member', {
      filter: { group },
      include: 'user,permissions',
      page: { limit: 20 }
    }).then((records) => {
      this.updatePageState(records);
      return records;
    });
  }),

  removeMemberTask: task(function* (member) {
    yield member.destroyRecord().catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  }).group('actionsTaskGroup'),

  banMemberTask: task(function* (member) {
    yield get(this, 'store').createRecord('group-ban', {
      group: get(this, 'group'),
      user: get(member, 'user'),
      moderator: get(this, 'session.account')
    }).save().catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  }).group('actionsTaskGroup')
});
