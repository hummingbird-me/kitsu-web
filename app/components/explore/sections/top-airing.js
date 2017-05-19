import BaseComponent from 'client/components/explore/sections/-base';
import layout from 'client/templates/components/explore/sections/-base';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';

export default BaseComponent.extend({
  layout,
  title: 'Top Airing',
  more: 'explore.more',
  name: 'top-airing',

  init() {
    this._super(...arguments);
    get(this, 'getDataTask').perform().catch((error) => {
      get(this, 'raven').captureException(error);
    });
  },

  getDataTask: task(function* () {
    return yield get(this, 'store').query(get(this, 'mediaType'), {
      filter: { status: 'current' },
      sort: '-userCount',
      page: { limit: get(this, 'limit') }
    });
  }).restartable()
});
