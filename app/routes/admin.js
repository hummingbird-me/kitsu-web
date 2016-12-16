import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  session: service(),

  beforeModel() {
    const user = get(this, 'session.account');
    if (user === undefined || !user.hasRole('admin')) {
      return this.transitionTo('dashboard');
    }
  }
});
