import Route from 'ember-route';
import get from 'ember-metal/get';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return get(this, 'store').query('feed', {
      type: 'notifications',
      id: get(this, 'session.account.id'),
      include: 'actor,target.post'
    });
  }
});
