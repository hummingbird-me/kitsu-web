import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import jQuery from 'jquery';
import getter from 'client/utils/getter';
import moment from 'moment';

export default Controller.extend({
  mediaQueryParams: [
    'averageRating',
    'genres',
    'text',
    'year'
  ],
  averageRating: [0.5, 5.0],
  genres: [],
  text: undefined,
  year: [1907, moment().year()],

  // Buffer values so we don't mutate the query params every update
  dirtyYear: [1907, moment().year()],
  dirtyRating: [0.5, 5.0],
  dirtyEpisodes: [1, 100],

  isAnime: getter(function() {
    const media = get(this, 'model.firstObject');
    if (media !== undefined) {
      return media.constructor.modelName === 'anime';
    }
  }),

  isManga: getter(function() {
    const media = get(this, 'model.firstObject');
    if (media !== undefined) {
      return media.constructor.modelName === 'manga';
    }
  }),

  currentYear: getter(() => moment().year()),

  init() {
    this._super(...arguments);
    const mediaQueryParams = get(this, 'mediaQueryParams');
    const queryParams = get(this, 'queryParams');
    set(this, 'queryParams', Object.assign(mediaQueryParams, queryParams));
  },

  _handleScroll() {
    if (jQuery(document).scrollTop() >= 51) {
      jQuery('.filter-options').addClass('scrolled');
      jQuery('.search-media').addClass('scrolled');
    } else {
      jQuery('.filter-options').removeClass('scrolled');
      jQuery('.search-media').removeClass('scrolled');
    }
  }
});
