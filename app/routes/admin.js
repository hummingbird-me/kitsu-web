import Route from '@ember/routing/route';
import { get } from '@ember/object';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  beforeModel() {
    const user = get(this, 'session.account');
    if (user === undefined || !user.hasRole('admin')) {
      return this.transitionTo('dashboard');
    }
  }
});
