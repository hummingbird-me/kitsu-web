import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['card', 'user-card'],
  classNameBindings: ['short:short:col-sm-3'],
  short: false,
  queryCache: service(),

  didReceiveAttrs() {
    const currentUser = get(this, 'session.hasUser') && get(this, 'session.account.id');
    if (currentUser) {
      get(this, 'queryCache').query('follow', {
        filter: {
          follower: currentUser,
          followed: get(this, 'user.id')
        }
      }).then(records => set(this, 'follow', get(records, 'firstObject')));
    }
  }
});
