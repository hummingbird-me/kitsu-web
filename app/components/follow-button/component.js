import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  session: service(),
  store: service(),

  init() {
    this._super(...arguments);
    set(this, 'guest', false);

    set(this, 'follower', get(this, 'session.account'));
    set(this, 'followed', get(this, 'user'));

    if ((get(this, 'follower') === undefined) ||
        (get(this, 'followed') === undefined)) {
      set(this, 'following', false);
      set(this, 'guest', true);
      return;
    }

    get(this, 'prepare').perform();
  },

  prepare: task(function* () {
    yield get(this, 'store').query('follow', {
      filter: {
        follower: get(this, 'follower.id'),
        followed: get(this, 'followed.id')
      }
    }).then((e) => {
      set(this, 'relationship', get(e, 'firstObject'));
      set(this, 'following', (get(e, 'firstObject') !== undefined));
    });
  }),

  toggle: task(function* () {
    if (get(this, 'following')) {
      yield get(this, 'relationship').destroyRecord().then(() => {
        set(this, 'relationship', null);
        set(this, 'following', false);
      });
    } else {
      if (get(this, 'guest')) {
        // Handle guest case!
      }

      yield get(this, 'store').createRecord('follow', {
        follower: get(this, 'follower'),
        followed: get(this, 'followed')
      }).save().then((e) => {
        set(this, 'relationship', e);
        set(this, 'following', true);
      });
    }
  }).restartable()
});
