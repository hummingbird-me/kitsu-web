import Controller from '@ember/controller';
import { get, set, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { image } from 'client/helpers/image';

export default Controller.extend({
  isEditing: false,
  user: alias('model'),

  queryCache: service(),

  coverImageStyle: computed('user.coverImage', function() {
    const coverImage = image(get(this, 'user.coverImage'));
    return `background-image: url("${coverImage}")`.htmlSafe();
  }).readOnly(),

  fetchFollowTask: task(function* () {
    const currentUser = get(this, 'session.hasUser') && get(this, 'session.account.id');
    if (!currentUser) { return; }
    const records = yield get(this, 'queryCache').query('follow', {
      filter: {
        follower: currentUser,
        followed: get(this, 'user.id')
      }
    });
    set(this, 'follow', get(records, 'firstObject'));
  }).restartable()
});
