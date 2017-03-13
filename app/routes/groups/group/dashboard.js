import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { CanMixin } from 'ember-can';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';
import jQuery from 'jquery';

export default Route.extend(AuthenticatedRouteMixin, CanMixin, {
  authenticationRoute: 'dashboard',
  ajax: service(),

  model() {
    const group = this.modelFor('groups.group');
    return RSVP.hash({
      group,
      membership: get(group, 'userMembership'),
      stats: get(this, 'ajax').request(`/groups/${get(group, 'id')}/_stats`)
    });
  },

  afterModel(model) {
    const membership = get(model, 'membership');
    if (!this.can('view dashboard for group', { membership })) {
      this.transitionTo('groups.group.group-page.index');
    }
  },

  activate() {
    this._super(...arguments);
    jQuery('body').addClass('settings-page');
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('settings-page');
  }
});
