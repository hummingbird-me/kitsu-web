import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),

  updateInviteTask: task(function* (type) {
    const id = get(this, 'model.id');
    return yield get(this, 'ajax').post(`/group-invites/${id}/_${type}`);
  }),

  actions: {
    acceptInvite() {
      if (get(this, 'updateInviteTask.isRunning')) { return; }
      get(this, 'updateInviteTask').perform('accept').then(() => {
        this.transitionToRoute('groups.group.group-page.index', get(this, 'model.group'));
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
