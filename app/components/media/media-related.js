import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { classify } from '@ember/string';
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
      filter: {
        source_id: get(this, 'media.id'),
        source_type: classify(get(this, 'media.modelType'))
      },
      include: 'destination',
      sort: 'role',
      page: { limit: 4 }
    });
    if (get(response, 'length') === 0) {
      set(this, 'shouldRender', false);
    }
    return response;
  }).drop()
});
