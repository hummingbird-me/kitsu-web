import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { reads } from 'ember-computed';
import { isEmpty } from 'ember-utils';
import { task, timeout } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Controller.extend({
  notify: service(),
  store: service(),
  taskValue: reads('model.taskInstance.value'),

  /** Query API for users */
  searchUsers: task(function* (query) {
    yield timeout(250);
    const users = yield get(this, 'store').query('user', {
      filter: { query },
      page: { limit: 10 }
    });
    // Reject the local user from the results
    return users.reject(user => get(this, 'session').isCurrentUser(user));
  }).restartable(),

  actions: {
    blockUser() {
      if (isEmpty(get(this, 'currentSelection'))) { return; }
      const user = get(this, 'currentSelection');
      const block = get(this, 'store').createRecord('block', {
        user: get(this, 'session.account'),
        blocked: user
      });
      block.save().then(() => {
        get(this, 'notify').success(`${get(user, 'name')} was blocked.`);
        set(this, 'currentSelection', null);
        // add this block to our store
        const content = get(this, 'taskValue').toArray();
        content.addObject(block);
        set(this, 'taskValue', content);
      }).catch((err) => {
        get(this, 'notify').error(errorMessages(err));
      });
    },

    unblockUser(block) {
      const name = get(block, 'blocked.name');
      block.destroyRecord().then(() => {
        get(this, 'notify').success(`${name} was unblocked.`);
        get(this, 'taskValue').removeObject(block);
      }).catch((err) => {
        get(this, 'notify').error(errorMessages(err));
      });
    }
  }
});
