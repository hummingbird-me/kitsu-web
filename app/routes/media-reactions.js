import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  model({ id }) {
    return get(this, 'store').findRecord('media-reaction', id, {
      include: 'user,anime,manga',
      reload: true
    });
  }
});
