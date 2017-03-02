import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['invite-users'],
  store: service(),

  searchUsersTask: task(function* (query) {
    if (isEmpty(query)) { return []; }
    yield timeout(250);
    return yield get(this, 'store').query('user', {
      filter: { query }
    });
  }).restartable(),

  actions: {
    searchUsers(query) {
      if (get(this, 'query') === query) { return; }
      set(this, 'query', query);
      get(this, 'searchUsersTask').perform(query);
    }
  }
});
