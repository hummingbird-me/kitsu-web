import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty, typeOf } from 'ember-utils';
import { isEmberArray } from 'ember-array/utils';
import { task, timeout } from 'ember-concurrency';
import SlideHeaderMixin from 'client/mixins/routes/slide-header';
import Queryable from 'client/mixins/routes/queryable';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(SlideHeaderMixin, Queryable, Pagination, {
  templateName: 'media/index',
  queryCache: service(),

  refreshDebounced: task(function* () {
    yield timeout(1000);
    this.refresh();
  }).restartable(),

  beforeModel() {
    this._super(...arguments);
    const controller = this.controllerFor(get(this, 'routeName'));
    if (get(controller, 'availableGenres') !== undefined) {
      return;
    }
    get(this, 'queryCache').query('genre', {
      page: { limit: 10000, offset: 0 }
    }).then(genres => set(controller, 'availableGenres', genres.sortBy('name')));
  },

  model(params) {
    // If the request hasn't changed since the last successful request,
    // then just return that value.
    const lastTask = get(this, 'modelTask.lastSuccessful');
    const paramsChanged = JSON.stringify(params) !== JSON.stringify(get(this, 'lastParams'));
    if (lastTask && !paramsChanged) {
      return { taskInstance: lastTask, paginatedRecords: [] };
    }
    set(this, 'lastParams', params);
    const options = this._getRequestOptions(params);
    const [mediaType] = get(this, 'routeName').split('.');
    return {
      taskInstance: this.queryPaginated(mediaType, options),
      paginatedRecords: []
    };
  },

  setupController(controller) {
    this._super(...arguments);
    document.body.classList.add('browse-page');
    this.handleScroll = () => { controller._handleScroll(); };
    document.addEventListener('scroll.media', this.handleScroll);
    controller._setDirtyValues();
  },

  resetController() {
    this._super(...arguments);
    document.body.classList.remove('browse-page');
    document.removeEventListener('scroll.media', this.handleScroll);
  },

  headTags() {
    const [mediaType] = get(this, 'routeName').split('.');
    const description = `Looking for that ${mediaType}? Find all the best anime and manga
      on Kitsu!`;
    return [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        property: 'description',
        content: description
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: description
      }
    }];
  },

  actions: {
    refresh() {
      this.refresh();
    }
  },

  _getRequestOptions(params) {
    const options = {
      filter: {},
      page: { offset: 0, limit: 20 },
      fields: this._getFieldsets()
    };
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (isEmpty(value) === true) {
        return;
      } else if (isEmberArray(value) === true) {
        const filtered = value.reject(x => isEmpty(x));
        if (isEmpty(filtered) === true) {
          return;
        }
      }
      if (key !== 'sort') {
        const type = typeOf(value);
        options.filter[key] = this.serializeQueryParam(value, key, type);
      }
    });

    if (options.filter.text === undefined) {
      options.sort = this._getSortingKey(params.sort);
    }
    return options;
  },

  _getFieldsets() {
    const [mediaType] = get(this, 'routeName').split('.');
    return {
      [mediaType]: [
        'slug',
        'canonicalTitle',
        'titles',
        'posterImage',
        'synopsis',
        'averageRating',
        'startDate',
        'popularityRank',
        'ratingRank'
      ].join(',')
    };
  },

  _getSortingKey(sort) {
    switch (sort) {
      case 'rating':
        return '-average_rating';
      case 'date':
        return '-start_date';
      default:
        return '-user_count';
    }
  }
});
