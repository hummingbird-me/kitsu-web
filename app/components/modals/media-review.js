import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { assert } from 'ember-metal/utils';
import { invokeAction } from 'ember-invoke-action';
import errorMessages from 'client/utils/error-messages';
import { modelType } from 'client/helpers/model-type';
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

  metrics: service(),
  notify: service(),
  session: service(),
  store: service(),

  isValid: computed('validations.isInvalid', 'entry.rating', {
    get() {
      let isValid = get(this, 'validations.isInvalid') === false &&
        get(this, 'entry.rating') > 0;
      isValid = get(this, 'review') === undefined ? isValid : isValid &&
        get(this, 'content') !== get(this, 'review.content');
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
    invokeAction(this, 'updateEntry', get(this, 'entry'), 'rating', get(this, 'entry.rating'));
    set(review, 'content', get(this, 'content'));
    yield review.save()
      .then(() => {
        set(review, 'rating', get(this, 'entry.rating'));
        this.$('.modal').modal('hide');
        get(this, 'metrics').trackEvent({
          category: 'review',
          action: 'create',
          label: modelType([get(review, 'media')]),
          value: get(review, 'media.id')
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
    } else {
      set(this, 'review', review);
      set(this, 'content', get(review, 'content'));
      get(this, 'review.media').then(media => set(this, 'media', media));
      get(this, 'review.libraryEntry').then(entry => set(this, 'entry', entry));
    }
  },

  actions: {
    updateEntry(entry, property, ...args) {
      set(entry, 'rating', ...args);
    }
  }
});
