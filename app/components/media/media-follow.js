import FollowComponent from 'client/components/follow-button';
import layout from 'client/templates/components/follow-button';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import { capitalize } from 'ember-string';
import errorMessages from 'client/utils/error-messages';

export default FollowComponent.extend({
  layout,

  getFollowStatus: task(function* () {
    return yield get(this, 'queryCache').query('media-follow', this._getRequestOptions())
      .then(follow => set(this, 'relationship', get(follow, 'firstObject')));
  }).drop(),

  toggleFollow: task(function* () {
    if (get(this, 'session.isAuthenticated') === false) {
      return get(this, 'session.signUpModal')();
    }

    if (get(this, 'isFollowing')) {
      yield get(this, 'relationship').destroyRecord().then(() => {
        set(this, 'relationship', undefined);
        get(this, 'queryCache').invalidateQuery('media-follow', this._getRequestOptions());
      }).catch(err => get(this, 'notify').error(errorMessages(err)));
    } else {
      yield get(this, 'store').createRecord('media-follow', {
        user: get(this, 'session.account'),
        media: get(this, 'media')
      }).save().then((record) => {
        set(this, 'relationship', record);
        get(this, 'metrics').trackEvent({
          category: 'follow',
          action: 'create',
          label: 'media',
          value: get(this, 'media.id')
        });
      }).catch(err => get(this, 'notify').error(errorMessages(err)));
    }
  }).drop(),

  _getRequestOptions() {
    return {
      filter: {
        user_id: get(this, 'session.account.id'),
        media_type: capitalize(get(this, 'media.modelType')),
        media_id: get(this, 'media.id')
      }
    };
  }
});
