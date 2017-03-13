import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import CoverPageMixin from 'client/mixins/routes/cover-page';
import RSVP from 'rsvp';

export default Route.extend(CoverPageMixin, {
  ajax: service(),

  model() {
    const model = this.modelFor('groups.group');
    return RSVP.hash({
      group: model,
      membership: get(model, 'userMembership')
    });
  },

  afterModel(model) {
    this._super(...arguments);
    if (get(model, 'membership')) {
      const id = get(model, 'group.id');
      get(this, 'ajax').post(`/groups/${id}/_read`).catch(() => {});
    }
  }
});
