import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { typeOf } from 'ember-utils';

export default Mixin.create({
  actions: {
    updateNextPage(property, records, links) {
      if (typeOf(property) !== 'string') {
        property = 'model'; // eslint-disable-line no-param-reassign
        records = property; // eslint-disable-line no-param-reassign
        links = records;  // eslint-disable-line no-param-reassign
      }
      const controller = this.controllerFor(get(this, 'routeName'));
      if (controller === undefined) {
        return;
      }
      const content = get(controller, property).toArray();
      content.addObjects(records);
      set(controller, property, content);
      set(controller, `${property}.links`, links);
    }
  }
});
