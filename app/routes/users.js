import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import DataErrorMixin from 'client/mixins/routes/data-error';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(DataErrorMixin, CanonicalRedirectMixin, CoverPageMixin, {
  queryCache: service(),
  intl: service(),

  model({ name }) {
    if (name.match(/\D+/)) {
      return get(this, 'queryCache').query('user', {
        filter: { name },
        include: 'profileLinks.profileLinkSite,favorites.item'
      }).then(records => get(records, 'firstObject'));
    }
    return get(this, 'store').findRecord('user', name, {
      include: 'profileLinks.profileLinkSite,favorites.item'
    });
  },

  afterModel(model) {
    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
  },

  resetController(controller) {
    this._super(...arguments);
    set(controller, 'isEditing', false);
  },

  serialize(model) {
    return { name: get(model, 'name') };
  },

  setHeadTags(model) {
    const description = `${get(this, 'intl').t('head.users.description', { user: get(model, 'name') })} ${get(model, 'about')}`;
    return [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: description
      }
    }, {
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
        content: description
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-image',
      attrs: {
        property: 'og:image',
        content: get(model, 'avatar.medium') || get(model, 'avatar')
      }
    }];
  }
});
