import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import RSVP from 'rsvp';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  session: service(),

  beforeModel() {
    const user = get(this, 'session.account');
    if (user === undefined) {
      return this.transitionTo('dashboard');
    }

    return new RSVP.Promise((resolve) => {
      get(user, 'userRoles').then(roles => resolve(roles));
    }).then(roles => (
      RSVP.all(roles.map(role => get(role, 'role'))).then(() => {
        if (user.hasRole('admin') === false) {
          this.transitionTo('dashboard');
        }
      })
    ));
  }
});
