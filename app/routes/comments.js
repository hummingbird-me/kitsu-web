import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  intl: service(),

  model({ id }) {
    return get(this, 'store').findRecord('comment', id, {
      include: 'user,parent,post,post.user,post.targetUser,post.targetGroup,post.media',
      reload: true
    });
  },

  afterModel(model) {
    set(this, 'breadcrumb', `Comment by ${get(model, 'user.name')}`);
  },

  setupController(controller, model) {
    this._super(...arguments);
    const postId = get(model, 'post.id');
    const parentId = get(model, 'parent.id');
    set(controller, 'post', get(this, 'store').peekRecord('post', postId));
    set(controller, 'parent', get(this, 'store').peekRecord('comment', parentId));
  },

  titleToken(model) {
    const commenter = get(model, 'user.name');
    return get(this, 'intl').t('titles.comments', { user: commenter });
  }
});
