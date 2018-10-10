import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  ajax: service(),
  kinds: {
    posts: false,
    comments: false,
    reactions: false
  },

  deleteContent: task(function* () {
    const userId = get(this, 'user.id');
    const kind = Object.keys(get(this, 'kinds')).filter(k => get(this, `kinds.${k}`));
    yield get(this, 'ajax').request(`/users/${userId}/_nuke`, {
      method: 'POST',
      dataType: 'json',
      data: { kind }
    });
    get(this, 'onClose')();
  }).drop(),

  actions: {
    deleteContent() {
      get(this, 'deleteContent').perform();
    }
  }
});
