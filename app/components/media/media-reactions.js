import Component from 'ember-component';
import get from 'ember-metal/get';
import observer from 'ember-metal/observer';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  queryCache: service(),
  sortOptions: [
    '-upVotesCount',
    '-createdAt'
  ],
  sort: '-upVotesCount',

  refreshOnSort: observer('sort', function() {
    get(this, 'getReactionsTask').perform();
  }),

  getReactionsTask: task(function* () {
    const media = get(this, 'media');
    const type = get(media, 'modelType');
    const sort = get(this, 'sort');
    return yield get(this, 'queryCache').query('media-reaction', {
      include: 'user',
      filter: {
        [`${type}Id`]: get(media, 'id'),
      },
      page: { limit: 6 },
      sort
    });
  }).restartable(),

  init() {
    this._super(...arguments);
    get(this, 'getReactionsTask').perform();
  }
});
