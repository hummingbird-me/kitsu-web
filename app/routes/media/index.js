import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty, typeOf } from 'ember-utils';
import { isEmberArray } from 'ember-array/utils';
import { task, timeout } from 'ember-concurrency';
import jQuery from 'jquery';
import QueryableMixin from 'client/mixins/routes/queryable';
import SlideHeaderMixin from 'client/mixins/routes/slide-header';
import Pagination from 'client/mixins/pagination';
import { moment } from 'client/utils/moment';

export default Route.extend(SlideHeaderMixin, QueryableMixin, Pagination, {
  mediaQueryParams: {
    averageRating: { refreshModel: true, replace: true },
    genres: { refreshModel: true, replace: true },
    text: { refreshModel: true, replace: true },
    year: { refreshModel: true, replace: true }
  },
  templateName: 'media/index',

  refreshDebounced: task(function* () {
    yield timeout(1000);
    this.refresh();
  }).restartable(),

  modelTask: task(function* (mediaType, options) {
    return yield this.queryPaginated(mediaType, options);
  }).restartable(),

  init() {
    this._super(...arguments);
    const mediaQueryParams = get(this, 'mediaQueryParams');
    const queryParams = get(this, 'queryParams') || {};
    set(this, 'queryParams', Object.assign(mediaQueryParams, queryParams));
  },

  beforeModel() {
    this._super(...arguments);
    const controller = this.controllerFor(get(this, 'routeName'));
    if (get(controller, 'availableGenres') !== undefined) {
      return;
    }
    get(this, 'store').query('genre', {
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
    const hash = { page: { offset: 0, limit: 20 } };
    const filters = this._buildFilters(params);
    const options = Object.assign(filters, hash);
    const [mediaType] = get(this, 'routeName').split('.');
    return {
      taskInstance: get(this, 'modelTask').perform(mediaType, options),
      paginatedRecords: []
    };
  },

  afterModel() {
    // meta tags
    const [mediaType] = get(this, 'routeName').split('.');
    const desc = `Looking for that ${mediaType}? Find all the best anime and manga on Kitsu!`;
    set(this, 'headTags', [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: desc
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: desc
      }
    }]);
  },

  setupController(controller) {
    this._super(...arguments);
    jQuery(document.body).addClass('browse-page');
    jQuery(document).on('scroll.media', () => controller._handleScroll());
    controller._setDirtyValues();
  },

  resetController() {
    this._super(...arguments);
    jQuery(document.body).removeClass('browse-page');
    jQuery(document).off('scroll.media');
  },

  serializeQueryParam(value, key) {
    let result = this._super(...arguments);
    if (key === 'year') {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (upper === (moment().year() + 1)) {
          result = `${lower}..`;
        }
      }
    } else if (key === 'averageRating') {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (lower === 1 && upper === 100) {
          result = undefined;
        } else if (lower === 1) {
          result = `..${upper}`;
        }
      }
    }
    return result;
  },

  deserializeQueryParam(value, key) {
    let result = this._super(...arguments);
    if (key === 'year') {
      if (value !== undefined) {
        const [lower, upper] = result;
        if (isEmpty(upper)) {
          result = [lower, moment().year() + 1];
        }
      }
    } else if (key === 'averageRating') {
      if (value !== undefined) {
        const [lower, upper] = result;
        if (isEmpty(lower)) {
          result = [1, upper];
        }
      }
    }
    return result;
  },

  actions: {
    refresh() {
      this.refresh();
    }
  },

  _buildFilters(params) {
    const options = { filter: {}, fields: this._getFieldsets() };
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
      const type = typeOf(value);
      options.filter[key] = this.serializeQueryParam(value, key, type);
    });

    if (options.filter.text === undefined) {
      options.sort = '-user_count';
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
        'averageRating'
      ].join(',')
    };
  }
});
