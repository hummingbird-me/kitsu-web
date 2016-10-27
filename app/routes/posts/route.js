import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Route.extend({
  metrics: service(),
  session: service(),

  model({ id }) {
    return get(this, 'store').findRecord('post', id, {
      include: 'user,targetUser,comments.user,postLikes.user'
    });
  },

  afterModel(model) {
    get(this, 'metrics').invoke('trackImpression', 'Stream', {
      content_list: [{
        foreign_id: `Post:${get(model, 'id')}`,
        actor: {
          id: `User:${get(this, 'session.account.id')}`,
          label: get(this, 'session.account.name')
        },
        verb: 'view',
        object: { id: `Post:${get(model, 'id')}` }
      }],
      feed_id: `post:${get(model, 'id')}`,
      location: get(this, 'routeName')
    });
  }
});
