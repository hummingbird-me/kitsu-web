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
  content: undefined,

  notify: service(),
  session: service(),
  store: service(),

  isValid: computed('validations.isInvalid', 'entry.rating', 'delete.isRunning', {
    get() {
      return get(this, 'validations.isInvalid') === false &&
        get(this, 'entry.rating') > 0 && get(this, 'delete.isRunning') === false;
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
    }
    set(review, 'content', get(this, 'content'));
    yield review.save()
      .then(() => {
        set(review, 'rating', get(this, 'entry.rating'));
        this.$('.modal').modal('hide');
      })
      .catch(err => get(this, 'notify').error(errorMessages(err)));
  }).drop(),

  delete: task(function* () {
    yield get(this, 'review').destroyRecord()
      .then(() => this.$('.modal').modal('hide'))
      .catch((err) => {
        get(this, 'review').rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
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
      invokeAction(this, 'updateEntry', entry, property, ...args);
    }
  }
});
