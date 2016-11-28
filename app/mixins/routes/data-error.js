import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';

export default Mixin.create({
  actions: {
    error(reason) {
      const status = get(reason, 'errors.firstObject.status');
      if (status === '500') {
        this.transitionTo('server-error');
      } else {
        this.transitionTo('/404');
      }
    }
  }
});
