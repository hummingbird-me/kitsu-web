import Route from 'ember-route';
import get from 'ember-metal/get';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(CanonicalRedirectMixin, CoverPageMixin, {
  templateName: 'media/show',

  model({ slug }) {
    const [mediaType] = get(this, 'routeName').split('.');
    if (slug.match(/\D+/)) {
      return get(this, 'store').query(mediaType, { filter: { slug } })
        .then(records => get(records, 'firstObject'));
    }
    return get(this, 'store').findRecord(mediaType, slug);
  },

  titleToken(model) {
    return get(model, 'canonicalTitle');
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  }
});
