import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { task, timeout } from 'ember-concurrency';

// NYI
export default Component.extend({
  store: service(),

  search: task(function *(modelType, value) {
    yield timeout(500);
    const field = 'text';
    return yield get(this, 'store').query(modelType, {
      filter: { [field]: value },
      page: { limit: 3 }
    });
  }).restartable(),

  actions: {
    reorderItems(items, item) {
      console.log(items, item);
    },

    addItem(item) {
      console.log(item);
    },

    removeItem(item) {
      console.log(item);
    }
  }
});
