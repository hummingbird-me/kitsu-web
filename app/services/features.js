import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Service.extend({
  ajax: service(),

  fetchFlags() {
    this.features = {};
    return get(this, 'ajax').request('_flags').then(response => {
      this.features = response;
    });
  },

  hasFeature(feature) {
    return !!this.features[feature];
  }
});
