import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import getter from 'client/utils/getter';
import errorMessages from 'client/utils/error-messages';
import { createLink } from 'client/helpers/create-link';
import { modelType } from 'client/helpers/model-type';

export default Component.extend({
  classNames: ['media'],
  isUserFocused: false,
  isExpanded: false,

  i18n: service(),

  i18nTitle: getter(function() {
    const review = get(this, 'i18n').t('reviews.review');
    const reviewLink = createLink(`/reviews/${get(this, 'review.id')}`, review);
    const userLink = createLink(`/users/${get(this, 'review.user.name')}`, get(this, 'review.user.name'));
    const type = modelType([get(this, 'media') || get(this, 'review.media')]);
    return get(this, 'i18n').t(`reviews.title.${type}`, {
      link: reviewLink,
      user: userLink,
      progress: get(this, 'review.progress')
    });
  }),

  init() {
    this._super(...arguments);
    if (get(this, 'media') !== undefined) {
      set(this, 'review.media', get(this, 'media'));
    }
  },

  actions: {
    updateEntry(entry, property, value) {
      set(entry, property, value);
      return entry.save().catch((err) => {
        entry.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
    }
  }
});
