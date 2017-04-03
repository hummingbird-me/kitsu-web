import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  model() {
    return get(this, 'store').query('linked-account', {
      filter: { user_id: get(this, 'session.account.id') }
    });
  }
});
