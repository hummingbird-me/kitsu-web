import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  actions: {
    error(reason) {
      const status = get(reason, 'errors.firstObject.status');
      if (status === '500') {
        this.replaceWith('server-error');
      } else {
        this.replaceWith('/404');
      }
    }
  }
});
