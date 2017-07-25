import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { notEmpty } from 'ember-computed';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'span',
  classNames: ['media-actions'],
  isIgnoring: notEmpty('ignore'),

  notify: service(),
  queryCache: service(),
  store: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'queryCache').query('media-ignore', this._getRequestOptions())
      .then(ignore => set(this, 'ignore', get(ignore, 'firstObject')));
  },

  _getRequestOptions() {
    return {
      filter: {
        userId: get(this, 'session.account.id'),
        mediaId: get(this, 'media.id')
      }
    };
  },

  actions: {
    toggleIgnore() {
      if (get(this, 'session.isAuthenticated') === false) {
        return get(this, 'session.signUpModal')();
      }

      if (get(this, 'isIgnoring')) {
        get(this, 'ignore').destroyRecord().then(() => {
          get(this, 'queryCache').invalidateQuery('ignore', this._getRequestOptions());
          set(this, 'ignore', undefined);
        }).catch(err => get(this, 'notify').error(errorMessages(err)));
      } else {
        get(this, 'store').createRecord('media-ignore', {
          user: get(this, 'session.account'),
          media: get(this, 'media')
        }).save().then((record) => {
          set(this, 'ignore', record);
        }).catch(err => get(this, 'notify').error(errorMessages(err)));
      }
    }
  }
});
