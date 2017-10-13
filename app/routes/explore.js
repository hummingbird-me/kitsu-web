import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Route.extend({
  queryCache: service(),

  model() {
    return { userFavoritesTask: get(this, 'getUserFavoritesTask').perform() };
  },

  getUserFavoritesTask: task(function* () {
    if (!get(this, 'session.hasUser')) { return; }
    return yield get(this, 'queryCache').query('category-favorite', {
      include: 'category',
      filter: { user_id: get(this, 'session.account.id') },
      fields: { categoryFavorites: 'category', categories: 'title,slug' },
      page: { limit: 20 }
    });
  }).drop(),
});
