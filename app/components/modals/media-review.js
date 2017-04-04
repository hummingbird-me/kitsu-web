import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import { isPresent } from 'ember-utils';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-intl';

export default Component.extend({
  classNames: ['review-modal'],
  intl: service(),
  metrics: service(),
  rating: alias('review.libraryEntry.rating'),
  errorMessage: t('errors.request'),

  isValid: computed('rating', 'review.content', function() {
    return (get(this, 'rating') > 0) && isPresent(get(this, 'review.content'));
  }).readOnly(),

  saveReview: task(function* () {
    set(this, 'showError', false);
    // review ratings are copied from the library entries rating, so we have to update the
    // entry first
    const entry = get(this, 'review.libraryEntry');
    if (get(entry, 'hasDirtyAttributes')) {
      yield get(this, 'review.libraryEntry.content').save().catch(() => {
        set(this, 'showError', true);
        throw new Error(''); // exit out of the execution
      });
    }
    yield get(this, 'review').save().then(() => {
      this.$('.modal').modal('hide');
      this._trackCreation();
    }).catch(() => {
      set(this, 'showError', true);
    });
  }).drop(),

  /**
   * Load the required relationships as our JSON:API may not have included the data.
   * `.load()` will just return the local data if it has it.
   */
  loadRelationships: task(function* () {
    yield get(this, 'review').belongsTo('libraryEntry').load();
    yield get(this, 'review').belongsTo('media').load();
    set(this, 'review.libraryEntry.media', get(this, 'review.media'));
  }).drop(),

  init() {
    this._super(...arguments);
    // make sure the required data is loaded into the mode
    get(this, 'loadRelationships').perform();
  },

  willDestroyElement() {
    this._super(...arguments);
    get(this, 'review').rollbackAttributes();
  },

  _trackCreation() {
    get(this, 'metrics').trackEvent({
      category: 'review',
      action: 'create',
      value: get(this, 'review.id')
    });
  }
});
