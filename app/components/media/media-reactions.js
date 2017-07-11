import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { or, alias } from 'ember-computed';
import { task } from 'ember-concurrency';
import Pagination from 'kitsu-shared/mixins/pagination';
import { concat } from 'client/utils/computed-macros';

const LIMIT_COUNT = 6;

export default Component.extend(Pagination, {
  tagName: '',
  noLimit: false,
  sortOptions: ['-upVotesCount', '-createdAt'],
  sort: '-upVotesCount',
  queryCache: service(),
  tasksRunning: or('getReactionsTask.isRunning', 'getLibraryEntryTask.isRunning'),
  libraryEntry: alias('getLibraryEntryTask.last.value'),
  reactions: concat('getReactionsTask.last.value', 'paginatedRecords'),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getReactionsTask').perform();
    get(this, 'getLibraryEntryTask').perform();
  },

  getReactionsTask: task(function* () {
    const limit = get(this, 'noLimit') ? undefined : LIMIT_COUNT;
    const sort = get(this, 'sort');
    return yield this.queryPaginated('media-reaction', {
      include: 'user',
      filter: this._getMediaFilter(),
      page: { limit },
      sort
    });
  }).drop(),

  getLibraryEntryTask: task(function* () {
    const userId = get(this, 'session.account.id');
    const mediaFilter = this._getMediaFilter();
    const response = yield get(this, 'queryCache').query('library-entry', {
      include: 'mediaReaction',
      filter: {
        userId,
        ...mediaFilter
      },
      page: { limit: 1 }
    });
    return get(response, 'firstObject');
  }).drop(),

  actions: {
    changeSort(sort) {
      set(this, 'sort', sort);
      get(this, 'getReactionsTask').perform();
    },

    openModal() {
      if (!get(this, 'session.hasUser')) {
        return get(this, 'session').signUpModal();
      }
      set(this, 'isModalOpen', true);
    }
  },

  _getMediaFilter() {
    const media = get(this, 'media');
    const type = get(media, 'modelType');
    return { [`${type}Id`]: get(media, 'id') };
  }
});
