import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { alias } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  ajax: service(),
  stats: alias('getStatsTask.lastSuccessful.value'),
  membersToday: alias('stats.today.members'),
  membersTotal: alias('stats.total.members'),
  postsToday: alias('stats.today.posts'),
  commentsToday: alias('stats.today.comments'),
  reportsTotal: alias('stats.total.openReports'),
  ticketsTotal: alias('stats.total.openTickets'),

  init() {
    this._super(...arguments);
    get(this, 'getStatsTask').perform();
  },

  getStatsTask: task(function* () {
    const id = get(this, 'group.id');
    return yield get(this, 'ajax').request(`/groups/${id}/_stats`);
  })
});
