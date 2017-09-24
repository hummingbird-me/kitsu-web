import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    const user = this.modelFor('users');
    return {
      taskInstance: this.queryPaginated('follow', {
        filter: { followed: get(user, 'id') },
        fields: { users: ['avatar', 'coverImage', 'name', 'slug'].join(',') },
        include: 'follower',
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
    return get(this, 'intl').t('titles.users.followers', { user: name });
  }
});
