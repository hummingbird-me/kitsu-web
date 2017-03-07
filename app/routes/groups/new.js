import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  authenticationRoute: 'dashboard',
  intl: service(),
  notify: service(),

  model() {
    return RSVP.hash({
      group: get(this, 'store').createRecord('group'),
      categories: get(this, 'store').findAll('group-category')
    });
  },

  actions: {
    createGroup() {
      const controller = this.controllerFor(get(this, 'routeName'));
      const group = get(controller, 'group');
      set(controller, 'isSaving', true);
      return group.save().then(() => {
        this.transitionTo('groups.group.group-page', group);
      }).catch(() => {
        get(this, 'notify').error(get(this, 'intl').t('errors.request'));
      }).finally(() => {
        set(controller, 'isSaving', false);
      });
    }
  }
});
