import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import errorMessages from 'client/utils/error-messages';

export default Controller.extend({
  notify: service(),

  actions: {
    unblockUser(block) {
      const name = get(block, 'blocked.name');
      block.destroyRecord()
        .then(() => get(this, 'notify').success(`${name} was unblocked.`))
        .catch(err => get(this, 'notify').error(errorMessages(err)));
    }
  }
});
