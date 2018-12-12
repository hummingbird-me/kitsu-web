import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import DataErrorMixin from 'client/mixins/routes/data-error';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(DataErrorMixin, CoverPageMixin, {
  queryCache: service(),
  intl: service(),

  model({ slug }) {
    if (slug.match(/\D+/)) {
      return get(this, 'queryCache').query('user', {
        filter: { slug },
        include: 'profileLinks.profileLinkSite,favorites.item,pinnedPost.user,pinnedPost.targetUser,pinnedPost.spoiledUnit,pinnedPost.media,pinnedPost.targetGroup,pinnedPost.uploads,stats'
      }).then(records => get(records, 'firstObject'));
    }
    return get(this, 'store').findRecord('user', slug, {
      include: 'profileLinks.profileLinkSite,favorites.item,pinnedPost.user,pinnedPost.targetUser,pinnedPost.spoiledUnit,pinnedPost.media,pinnedPost.targetGroup,pinnedPost.uploads,stats',
      reload: true
    });
  },

  afterModel(model) {
    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
  },

  setupController(controller) {
    this._super(...arguments);
    get(controller, 'fetchFollowTask').perform();
  },

  resetController(controller) {
    this._super(...arguments);
    set(controller, 'isEditing', false);
  },

  serialize(model) {
    return { slug: get(model, 'url') };
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
  },

  redirect(model) {
    const routeName = get(this, 'routeName');
    const params = this.paramsFor(routeName);
    const current = get(params, 'slug');
    const correct = get(model, 'url');
    if (current !== correct) {
      this.replaceWith(routeName, correct);
    }
  }
});
