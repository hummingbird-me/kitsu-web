import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty, typeOf } from '@ember/utils';
import { isArray } from '@ember/array';
import SlideHeaderMixin from 'client/mixins/routes/slide-header';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(SlideHeaderMixin, Pagination, {
  templateName: 'media/index',
  queryCache: service(),

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

  /**
   * Build the request object that is sent to our API.
   *
   * @private
   * @param {Object} params
   */
  _getRequestOptions(params) {
    const options = {
      filter: {},
      page: { offset: 0, limit: 20 },
      fields: this._getFieldsets()
    };
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (isEmpty(value)) {
        return;
      } if (isArray(value)) {
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

    if (!isEmpty(options.filter.unitCount)) {
      const [mediaType] = get(this, 'routeName').split('.');
      const unitKey = mediaType === 'anime' ? 'episodeCount' : 'chapterCount';
      options.filter[unitKey] = options.filter.unitCount;
      delete options.filter.unitCount;
    }

    if (isEmpty(options.filter.text)) {
      options.sort = this._getSortingKey(params.sort);
    }
    return options;
  },

  /**
   * Build the fieldsets object that is sent to our API.
   *
   * @private
   */
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

  /**
   * Converts the client-side sorting key to one the server API expects.
   *
   * @private
   * @param {String} sort
   */
  _getSortingKey(sort) {
    switch (sort) {
      case 'rating':
        return '-average_rating';
      case 'date':
        return '-start_date';
      case 'recent':
        return '-created_at';
      default:
        return '-user_count';
    }
  }
});
