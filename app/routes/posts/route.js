import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  model({ id }) {
    return get(this, 'store').findRecord('post', id, {
      include: 'user,targetUser,comments.user,postLikes.user'
    });
  }
});
