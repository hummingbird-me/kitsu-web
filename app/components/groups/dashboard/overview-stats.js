import Component from 'ember-component';
import { alias } from 'ember-computed';

export default Component.extend({
  membersToday: alias('stats.today.members'),
  membersTotal: alias('stats.total.members'),
  postsToday: alias('stats.today.posts'),
  commentsToday: alias('stats.today.comments'),
  reportsTotal: alias('stats.total.openReports'),
  ticketsTotal: alias('stats.total.openTickets')
});
