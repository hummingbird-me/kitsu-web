import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  sortOptions: [
    '-upVotesCount',
    '-createdAt'
  ],
  sort: '-upVotesCount',

  queryCache: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getReactionsTask').perform();
    get(this, 'getLibraryEntryTask').perform();
  },

  actions: {
    changeSort(sort) {
      set(this, 'sort', sort);
      get(this, 'getReactionsTask').perform();
    }
  },

  getReactionsTask: task(function* () {
    const sort = get(this, 'sort');
    return yield get(this, 'queryCache').query('media-reaction', {
      include: 'user',
      filter: this._getMediaFilter(),
      page: { limit: 6 },
      sort
    });
  }).restartable(),

  getLibraryEntryTask: task(function* () {
    const userId = get(this, 'session.account.id');
    const mediaFilter = this._getMediaFilter();
    const entries = yield get(this, 'queryCache').query('library-entry', {
      include: 'mediaReaction',
      filter: {
        userId,
        ...mediaFilter
      },
      page: { limit: 1 }
    });
    set(this, 'libraryEntry', get(entries, 'firstObject'));
  }).drop(),

  _getMediaFilter() {
    const media = get(this, 'media');
    const type = get(media, 'modelType');
    return { [`${type}Id`]: get(media, 'id') };
  }
});
