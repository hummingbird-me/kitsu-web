import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Helper.extend({
  features: service(),

  compute([feature]) {
    return get(this, 'features').hasFeature(feature);
  }
});
