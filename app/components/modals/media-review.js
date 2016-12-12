import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { assert } from 'ember-metal/utils';
import { invokeAction } from 'ember-invoke-action';
import errorMessages from 'client/utils/error-messages';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  content: [
    validator('presence', true),
    validator('length', { min: 10 })
  ]
});

export default Component.extend(Validations, {
  classNames: ['review-modal'],
  content: undefined,
  rating: 0,
  spoiler: false,

  metrics: service(),
  notify: service(),
  session: service(),
  store: service(),

  isValid: computed('validations.isInvalid', 'rating', 'spoiler', 'content', {
    get() {
      let isValid = get(this, 'validations.isValid') && get(this, 'rating') > 0;
      isValid = get(this, 'review') === undefined ? isValid : isValid &&
        (get(this, 'content') !== get(this, 'review.content') ||
          get(this, 'rating') !== get(this, 'review.rating') ||
          get(this, 'spoiler') !== get(this, 'review.spoiler'));
      return isValid;
    }
  }).readOnly(),

  publish: task(function* () {
    let review = get(this, 'review');
    if (review === undefined) {
      review = get(this, 'store').createRecord('review', {
        libraryEntry: get(this, 'entry'),
        media: get(this, 'media'),
        user: get(this, 'session.account')
      });
      set(this, 'isNew', true);
    }
    yield invokeAction(this, 'updateEntry', get(this, 'entry'), 'rating', get(this, 'rating'));
    set(review, 'content', get(this, 'content'));
    set(review, 'spoiler', get(this, 'spoiler'));
    yield review.save()
      .then(() => {
        this.$('.modal').modal('hide');
        get(this, 'metrics').trackEvent({
          category: 'review',
          action: 'create',
          value: get(review, 'id')
        });
      })
      .catch(err => get(this, 'notify').error(errorMessages(err)));
  }).drop(),

  init() {
    this._super(...arguments);
    const review = get(this, 'review');
    if (review === undefined) {
      assert('Must pass entry and media if review is new to {{media-review}}',
        get(this, 'media') !== undefined && get(this, 'entry') !== undefined);
      set(this, 'rating', get(this, 'entry.rating'));
    } else {
      set(this, 'review', review);
      set(this, 'content', get(review, 'content'));
      set(this, 'spoiler', get(review, 'spoiler'));
      if (get(this, 'media') === undefined) {
        get(this, 'review.media').then(media => set(this, 'media', media));
      }
      get(this, 'review.libraryEntry').then((entry) => {
        set(this, 'entry', entry);
        set(this, 'rating', get(this, 'entry.rating'));
      });
    }
  },

  actions: {
    updateRating(rating) {
      set(this, 'rating', rating);
    }
  }
});
