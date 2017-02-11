import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  i18n: service(),
  metrics: service(),

  model({ id }) {
    return get(this, 'store').findRecord('post', id, {
      include: 'user,targetUser,media',
      reload: true
    });
  },

  afterModel(model) {
    set(this, 'breadcrumb', `Post by ${get(model, 'user.name')}`);
    get(this, 'metrics').invoke('trackImpression', 'Stream', {
      content_list: [`Post:${get(model, 'id')}`],
      location: get(this, 'routeName')
    });
  },

  titleToken() {
    const model = this.modelFor('posts');
    const name = get(model, 'user.name');
    return get(this, 'i18n').t('titles.posts', { user: name });
  }
});
