import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import DataErrorMixin from 'client/mixins/routes/data-error';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(DataErrorMixin, CanonicalRedirectMixin, CoverPageMixin, {
  model({ name }) {
    if (name.match(/\D+/)) {
      return get(this, 'store').query('user', { filter: { name }, include: 'userRoles.role' })
        .then(records => get(records, 'firstObject'));
    }
    return get(this, 'store').findRecord('user', name, { include: 'userRoles.role' });
  },

  afterModel(model) {
    // TODO - @Josh - Custom description for a user's profile (SEO / Embeds)
    const desc = `Check out ${get(model, 'name')}'s anime, manga, favorites, and more of what you love on Kitsu.`;
    set(this, 'headTags', [{
      type: 'meta',
      tagId: 'meta-og-type',
      attrs: {
        property: 'og:type',
        content: 'profile'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: desc
      }
    }, {
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: desc
      }
    }]);
  },

  serialize(model) {
    return { name: get(model, 'name') };
  }
});
