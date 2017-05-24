import Component from 'ember-component';
import get from 'ember-metal/get';
import { setProperties } from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';

export default Component.extend({
  classNames: ['category-widget', 'is-sticky'],
  store: service(),

  categories: concat('parent', 'siblings', 'children'),

  init() {
    this._super(...arguments);
    get(this, 'getDataTask').perform().catch((error) => {
      get(this, 'raven').captureException(error);
    });
  },

  getDataTask: task(function* () {
    const category = get(this, 'category');
    const parent = yield get(category, 'parent');
    const siblings = yield get(this, 'getChildrenTask')
      .perform(get(parent, 'id'));
    const children = yield get(this, 'getChildrenTask')
      .perform(get(category, 'id'));
    setProperties(this, { parent: [parent], siblings, children });
  }).restartable(),

  getChildrenTask: task(function* (parentId) {
    return yield get(this, 'store').query('category', {
      filter: { parentId }
    });
  }),
});
