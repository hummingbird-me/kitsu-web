import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  model() {
    return get(this, 'store').query('report', {
      include: 'user,naughty,moderator',
      filter: { status: 0 },
      page: { limit: 20 }
    });
  }
});
