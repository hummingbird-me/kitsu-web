import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty, typeOf } from 'ember-utils';
import { isEmberArray } from 'ember-array/utils';
import SlideHeaderMixin from 'client/mixins/routes/slide-header';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(SlideHeaderMixin, Pagination, {
  templateName: 'media/index',
  queryCache: service(),

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
    const options = this._getRequestOptions(params);
    const [mediaType] = get(this, 'routeName').split('.');
    return {
      taskInstance: this.queryPaginated(mediaType, options),
      paginatedRecords: []
    };
  },

  activate() {
    this._super(...arguments);
    document.body.classList.add('browse-page');
  },

  deactivate() {
    this._super(...arguments);
    document.body.classList.remove('browse-page');
  },

  setupController(controller) {
    this._super(...arguments);
    controller._setDirtyValues();
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
      if (isEmpty(value)) {
        return;
      } else if (isEmberArray(value)) {
        const filtered = value.reject(x => isEmpty(x));
        if (isEmpty(filtered)) {
          return;
        }
      }
      if (key !== 'sort') {
        const type = typeOf(value);
        options.filter[key] = this.serializeQueryParam(value, key, type);
      }
    });

    if (isEmpty(options.filter.text)) {
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
