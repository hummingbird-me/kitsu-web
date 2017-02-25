import Route from 'ember-route';
import get from 'ember-metal/get';
import CoverPageMixin from 'client/mixins/routes/cover-page';
import RSVP from 'rsvp';

export default Route.extend(CoverPageMixin, {
  model() {
    return RSVP.hash({
      group: this.modelFor('groups.group'),
      membership: this._getMembershipStatus()
    });
  },

  _getMembershipStatus() {
    const group = this.modelFor('groups.group');
    return get(this, 'store').query('group-member', {
      include: 'user',
      filter: {
        group: get(group, 'id'),
        user: get(this, 'session.account.id')
      }
    }).then(records => get(records, 'firstObject'));
  }
});
