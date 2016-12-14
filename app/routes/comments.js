import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Route.extend({
  i18n: service(),

  model({ id }) {
    return get(this, 'store').findRecord('comment', id, {
      include: 'user,post,post.user,post.targetUser,post.media',
      reload: true
    });
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'post', this.modelFor('posts'));
  },

  titleToken(model) {
    const commenter = get(model, 'user.name');
    return get(this, 'i18n').t('titles.posts.comments', { user: commenter });
  }
});
