import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import CoverPageMixin from 'client/mixins/routes/cover-page';
import RSVP from 'rsvp';

export default Route.extend(CoverPageMixin, {
  breadcrumb: null,
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
