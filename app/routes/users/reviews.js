import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    const user = this.modelFor('users');
    return {
      taskInstance: this.queryPaginated('review', {
        include: 'user,media',
        filter: {
          user_id: get(user, 'id')
        }
      }),
      paginatedRecords: []
    };
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.reviews', { user: name });
  }
});
