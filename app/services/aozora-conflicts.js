import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Service.extend({
  ajax: service(),

  list() {
    return get(this, 'ajax').request('/users/_conflicts', {
      method: 'GET'
    });
  },

  resolve(chosen) {
    return get(this, 'ajax').request('/users/_conflicts', {
      method: 'POST',
      dataType: 'json',
      data: { chosen }
    });
  }
});
