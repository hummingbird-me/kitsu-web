import BaseComponent from 'client/components/trending/-base';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { capitalize } from 'ember-string';

export default BaseComponent.extend({
  classNames: ['just-reviewed'],
  currentTab: 'anime',
  store: service(),

  getDataTask: task(function* (type) {
    return yield get(this, 'store').query('review', {
      filter: {
        media_type: capitalize(type)
      },
      include: 'user,media',
      sort: '-likes_count',
      page: { limit: 14 }
    });
  }).restartable()
});
