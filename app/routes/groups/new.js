import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  authenticationRoute: 'dashboard',
  intl: service(),
  notify: service(),

  model() {
    return RSVP.hash({
      group: get(this, 'store').createRecord('group'),
      categories: get(this, 'store').query('group-category', {})
    });
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'selectedCategory', null);
  },

  actions: {
    createGroup() {
      const controller = this.controllerFor(get(this, 'routeName'));
      const group = get(controller, 'group');
      set(controller, 'isSaving', true);
      return group.save().then(() => {
        this.transitionTo('groups.group.group-page', get(group, 'slug'));
      }).catch(() => {
        get(this, 'notify').error(get(this, 'intl').t('errors.request'));
      }).finally(() => {
        set(controller, 'isSaving', false);
      });
    }
  }
});
