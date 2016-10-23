import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Component.extend({
  session: service(),
  store: service(),

  init() {
    this._super(...arguments);

    set(this, 'follower', get(this, 'session.account'));
    set(this, 'followed', get(this, 'user'));
    set(this, 'loading', false);

    if (get(this, 'follower') === null || get(this, 'followed') === null) {
      set(this, 'following', false);
      return;
    }

    get(this, 'store').query('follow', {
      filter: {
        follower: get(this, 'follower.id'),
        followed: get(this, 'followed.id')
      }
    }).then((e) => {
      set(this, 'relationship', get(e, 'firstObject'));
      set(this, 'following', (get(e, 'firstObject') !== undefined));
    });
  },

  actions: {
    toggleFollow() {
      set(this, 'loading', true);

      if (get(this, 'following')) {
        get(this, 'relationship').destroyRecord().then(() => {
          set(this, 'relationship', null);
          set(this, 'loading', false);
          set(this, 'following', true);
        }, () => { set(this, 'loading', false); });
      } else {
        get(this, 'store').createRecord('follow', {
          follower: get(this, 'follower'),
          followed: get(this, 'followed')
        }).save().then((e) => {
          set(this, 'relationship', e);
          set(this, 'loading', false);
          set(this, 'following', false);
        }, () => { set(this, 'loading', false); });
      }
    }
  }
});
