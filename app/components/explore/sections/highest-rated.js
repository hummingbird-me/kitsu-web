import BaseComponent from 'client/components/explore/sections/-base';
import layout from 'client/templates/components/explore/sections/-base';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';

export default BaseComponent.extend({
  layout,
  title: 'Highest Rated',

  init() {
    this._super(...arguments);
    get(this, 'getDataTask').perform().catch((error) => {
      get(this, 'raven').captureException(error);
    });
  },

  getDataTask: task(function* () {
    return yield get(this, 'store').query(get(this, 'mediaType'), {
      page: { limit: get(this, 'limit') },
      sort: '-averageRating'
    });
  }).restartable()
});
