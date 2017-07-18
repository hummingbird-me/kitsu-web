import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  shouldRender: true,
  queryCache: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getRelatedMediaTask').perform();
  },

  getRelatedMediaTask: task(function* () {
    const response = yield get(this, 'queryCache').query('media-relationship', {
      filter: { source_id: get(this, 'media.id') },
      include: 'destination',
      page: { limit: 4 }
    });
    if (get(response, 'length') === 0) {
      set(this, 'shouldRender', false);
    }
    return response;
  }).drop()
});
