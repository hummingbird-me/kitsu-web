import Route from 'ember-route';
import get from 'ember-metal/get';
import { assert } from 'ember-metal/utils';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(CoverPageMixin, {
  mediaType: undefined,
  templateName: 'media/show',

  init() {
    this._super(...arguments);
    const mediaType = get(this, 'mediaType');
    assert('Must provide a `mediaType` value', mediaType !== undefined);
  },

  model({ slug }) {
    const mediaType = get(this, 'mediaType');
    if (slug.match(/\D+/)) {
      return get(this, 'store').query(mediaType, { filter: { slug } })
        .then((records) => get(records, 'firstObject'));
    } else {
      return get(this, 'store').findRecord(mediaType, slug);
    }
  },

  titleToken(model) {
    return get(model, 'canonicalTitle');
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  }
});
