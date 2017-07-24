import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { or, notEmpty } from 'ember-computed';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'span',
  classNames: ['media-actions'],
  isFollowing: notEmpty('ignore'),
  isDisabled: or('getIgnoreStatusTask.isRunning', 'toggleIgnoreTask.isRunning'),

  notify: service(),
  queryCache: service(),
  store: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getIgnoreStatusTask').perform();
  },

  getIgnoreStatusTask: task(function* () {
    return yield get(this, 'queryCache').query('media-ignore', this._getRequestOptions())
      .then(ignore => set(this, 'ignore', get(ignore, 'firstObject')));
  }).drop(),

  toggleIgnoreTask: task(function* () {
    if (get(this, 'session.isAuthenticated') === false) {
      return get(this, 'session.signUpModal')();
    }

    if (get(this, 'isIgnoring')) {
      yield get(this, 'ignore').destroyRecord().then(() => {
        get(this, 'queryCache').invalidateQuery('ignore', this._getRequestOptions());
        set(this, 'ignore', undefined);
      }).catch(err => get(this, 'notify').error(errorMessages(err)));
    } else {
      yield get(this, 'store').createRecord('media-ignore', {
        user: get(this, 'session.account'),
        media: get(this, 'media')
      }).save().then((record) => {
        set(this, 'ignore', record);
      }).catch(err => get(this, 'notify').error(errorMessages(err)));
    }
  }).drop(),

  _getRequestOptions() {
    return {
      filter: {
        user: get(this, 'session.account.id'),
        media: get(this, 'media.id')
      }
    };
  },
});
