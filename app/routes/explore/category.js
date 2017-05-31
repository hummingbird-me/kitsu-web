import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Route.extend({
  queryCache: service(),

  model({ slug }) {
    return get(this, 'queryCache').query('category', {
      filter: { slug },
      include: 'parent.parent'
    }).then(records => get(records, 'firstObject'));
  },

  afterModel(model) {
    // Redirect if parent is nil, top-level categories aren't navigatable.
    const parent = model.belongsTo('parent').value();
    if (parent === null) {
      this.transitionTo('explore.index');
    }
  }
});
