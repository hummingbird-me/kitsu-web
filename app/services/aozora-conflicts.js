import Service, { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Service.extend({
  ajax: service(),

  list(user) {
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
