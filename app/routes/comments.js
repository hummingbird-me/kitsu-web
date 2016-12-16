import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  i18n: service(),

  model({ id }) {
    return get(this, 'store').findRecord('comment', id, {
      include: 'user,parent,post,post.user,post.targetUser,post.media',
      reload: true
    });
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'post', this.modelFor('posts'));
  },

  titleToken(model) {
    const commenter = get(model, 'user.name');
    return get(this, 'i18n').t('titles.comments', { user: commenter });
  }
});
