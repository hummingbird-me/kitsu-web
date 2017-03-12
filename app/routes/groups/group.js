import Route from 'ember-route';
import get from 'ember-metal/get';
import DataErrorMixin from 'client/mixins/routes/data-error';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';

export default Route.extend(DataErrorMixin, CanonicalRedirectMixin, {
  model({ slug }) {
    if (slug.match(/\D+/)) {
      return get(this, 'store').query('group', { filter: { slug } }).then(records => (
        get(records, 'firstObject')
      ));
    }
    return get(this, 'store').findRecord('group', slug);
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  }
});
