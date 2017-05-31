import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';

export default Route.extend({
  intl: service(),
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

    const { media_type: mediaType } = this.paramsFor('explore');
    set(this, 'breadcrumb', get(this, 'intl').t('titles.explore.category.index', {
      category: get(model, 'title'),
      type: capitalize(mediaType)
    }));
    set(this, 'headTags', this.setHeadTags(model));
  },

  setHeadTags(model) {
    return [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: get(model, 'description')
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: get(model, 'description')
      }
    }];
  }
});
