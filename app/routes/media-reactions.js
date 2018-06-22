import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  model({ id }) {
    return get(this, 'store').findRecord('media-reaction', id, {
      include: 'user,anime,manga',
      reload: true
    });
  },

  afterModel(model) {
    this._super(...arguments);

    const user = get(model, 'user.name');
    const crumb = `Reaction by ${user}`;
    set(this, 'breadcrumb', crumb);

    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
  },

  setHeadTags(model) {
    const description = get(model, 'reaction');
    return [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        property: 'description',
        content: description
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: `${get(model, 'media.canonicalTitle')} reaction by ${get(model, 'user.name')}`
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
        content: get(model, 'user.avatar.medium') || get(model, 'media.posterImage.medium')
      }
    }, {
      type: 'meta',
      tagId: 'meta-twitter-label1',
      attrs: {
        property: 'twitter:label1',
        content: 'Votes'
      }
    }, {
      type: 'meta',
      tagId: 'meta-twitter-data1',
      attrs: {
        property: 'twitter:data1',
        content: get(model, 'upVotesCount')
      }
    }];
  }
});
