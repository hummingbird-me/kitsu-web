import FollowComponent from 'client/components/follow-button/component';
import layout from 'client/components/follow-button/template';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import { capitalize } from 'ember-string';
import { mediaType } from 'client/helpers/media-type';

export default FollowComponent.extend({
  layout,

  getFollowStatus: task(function* () {
    return yield get(this, 'store').query('media-follow', {
      filter: {
        user_id: get(this, 'session.account.id'),
        media_type: capitalize(mediaType([get(this, 'media')])),
        media_id: get(this, 'media.id')
      }
    }).then(follow => set(this, 'relationship', get(follow, 'firstObject')));
  }).drop(),

  toggleFollow: task(function* () {
    if (get(this, 'session.isAuthenticated') === false) {
      return get(this, 'session.signUpModal')();
    }

    if (get(this, 'isFollowing')) {
      yield get(this, 'relationship').destroyRecord().then(() => {
        set(this, 'relationship', undefined);
      }).catch(() => { /* TODO: Feedback */ });
    } else {
      yield get(this, 'store').createRecord('media-follow', {
        user: get(this, 'session.account'),
        media: get(this, 'media')
      }).save().then((record) => {
        set(this, 'relationship', record);
      })
      .catch(() => { /* TODO: Feedback */ });
    }
  }).drop()
});
