import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  ajax: service(),
  alts: [],

  didReceiveAttrs() {
    this._super(...arguments);
    const userId = get(this, 'user.id');
    get(this, 'loadAlts').perform(userId);
  },

  loadAlts: task(function* (userId) {
    const alts = yield get(this, 'ajax').request(`/users/${userId}/_alts`);
    set(this, 'alts', alts);
  }).drop()
});
