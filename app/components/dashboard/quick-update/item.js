import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed, { equal } from 'ember-computed';
import service from 'ember-service/inject';
import { htmlSafe } from 'ember-string';
import { task } from 'ember-concurrency';
import { strictInvokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['quick-update-item'],
  intl: service(),
  store: service(),
  isCompleted: equal('entry.status', 'completed').readOnly(),

  nextProgress: computed('entry.progress', function() {
    const progress = get(this, 'entry.progress');
    const total = get(this, 'entry.media.unitCount');
    return progress === total ? progress : progress + 1;
  }).readOnly(),

  canComplete: computed('nextProgress', function() {
    return get(this, 'nextProgress') === get(this, 'entry.media.unitCount');
  }).readOnly(),

  /**
   * Get the translated subtext for the quick update item
   */
  episodeText: computed('isCompleted', 'nextProgress', 'entry.nextUnit', function() {
    // Completed?
    if (get(this, 'isCompleted')) {
      return get(this, 'intl').t('dashboard.quick-update.media.complete');
    }
    const type = get(this, 'entry.media.modelType');
    const num = get(this, 'nextProgress');
    const text = get(this, 'intl').t('dashboard.quick-update.media.episode', { type, num });
    // do we have the next unit information for this entry?
    const nextUnit = get(this, 'entry').belongsTo('nextUnit').value();
    if (nextUnit) {
      const title = get(this, 'entry.nextUnit.canonicalTitle');
      if (title) {
        return `${text} - ${title}`;
      }
    }
    return text;
  }).readOnly(),

  completedPercent: computed('entry.progress', function() {
    const progress = get(this, 'entry.progress');
    const total = get(this, 'entry.media.unitCount');
    const result = ((progress / total) * 100).toFixed(2);
    return htmlSafe(`width: ${result}%;`);
  }).readOnly(),

  updateEntryTask: task(function* () {
    const hash = { progress: get(this, 'nextProgress') };
    // will the next update complete this media?
    if (get(this, 'canComplete')) {
      hash.status = 'completed';
      // Load in the review relationship as there is an issue with the API and including
      // the relationship initially
      yield get(this, 'entry.review').then((review) => {
        if (review) {
          set(review, 'media', get(this, 'entry.media'));
          set(review, 'libraryEntry', get(this, 'entry'));
        } else {
          const newReview = this._createReview();
          set(this, 'entry.review', newReview);
        }
      });
    }
    yield strictInvokeAction(this, 'updateEntry', hash);
    yield strictInvokeAction(this, 'reloadUnit');
  }).drop(),

  _createReview() {
    return get(this, 'store').createRecord('review', {
      libraryEntry: get(this, 'entry'),
      media: get(this, 'entry.media'),
      user: get(this, 'session.account')
    });
  },

  actions: {
    rateEntry(rating) {
      strictInvokeAction(this, 'updateEntry', 'rating', rating);
    }
  }
});
