import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { alias } from 'ember-computed';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-i18n';

export default Component.extend({
  classNames: ['review-modal'],
  i18n: service(),
  metrics: service(),
  rating: alias('review.libraryEntry.rating'),
  errorMessage: t('errors.request'),

  saveReview: task(function* () {
    set(this, 'showError', false);
    // review ratings are copied from the library entries rating, so we have to update the
    // entry first
    set(this, 'rating', get(this, 'rating'));
    yield get(this, 'review.libraryEntry.content').save().catch(() => {
      set(this, 'showError', true);
      throw new Error(''); // exit out of the execution
    });
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
  loadRelationships: task(function* (entry, media) {
    yield entry.load();
    yield media.load();
  }).drop(),

  init() {
    this._super(...arguments);
    // make sure the required data is loaded into the model
    const entry = get(this, 'review').belongsTo('libraryEntry');
    const media = get(this, 'review').belongsTo('media');
    get(this, 'loadRelationships').perform(entry, media);
  },

  _trackCreation() {
    get(this, 'metrics').trackEvent({
      category: 'review',
      action: 'create',
      value: get(this, 'review.id')
    });
  }
});
