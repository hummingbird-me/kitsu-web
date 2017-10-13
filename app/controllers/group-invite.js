import Controller from '@ember/controller';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),
  invite: alias('model'),

  updateInviteTask: task(function* (type) {
    const id = get(this, 'invite.id');
    return yield get(this, 'ajax').post(`/group-invites/${id}/_${type}`);
  }),

  actions: {
    acceptInvite() {
      if (get(this, 'updateInviteTask.isRunning')) { return; }
      get(this, 'updateInviteTask').perform('accept').then(() => {
        this.transitionToRoute('groups.group.group-page.index', get(this, 'invite.group'));
      });
    },

    declineInvite() {
      if (get(this, 'updateInviteTask.isRunning')) { return; }
      get(this, 'updateInviteTask').perform('decline').then(() => {
        this.transitionToRoute('dashboard');
      });
    }
  }
});
