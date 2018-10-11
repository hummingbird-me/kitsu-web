import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  ajax: service(),
  notify: service(),

  banUser: task(function* () {
    const userId = get(this, 'user.id');
    yield get(this, 'ajax').request(`/users/${userId}/_ban`, { method: 'POST' });
    get(this, 'notify').success('User was banned');
  }).drop(),

  actions: {
    banUser() {
      get(this, 'banUser').perform();
    }
  }
});
