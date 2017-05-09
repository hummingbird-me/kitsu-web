import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    const user = this.modelFor('users');
    return {
      taskInstance: this.queryPaginated('follow', {
        filter: { follower: get(user, 'id') },
        fields: { users: ['avatar', 'coverImage', 'name'].join(',') },
        include: 'followed',
        sort: '-created_at',
        page: { limit: 20 }
      }),
      paginatedRecords: []
    };
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'user', this.modelFor('users'));
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.following', { user: name });
  }
});
