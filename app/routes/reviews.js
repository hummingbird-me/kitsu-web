import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  intl: service(),
  metrics: service(),

  model({ id }) {
    return get(this, 'store').findRecord('review', id, {
      include: 'user,media',
      reload: true
    });
  },

  afterModel(model) {
    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
    get(this, 'metrics').invoke('trackImpression', 'Stream', {
      content_list: [`Review:${get(model, 'id')}`],
      location: get(this, 'routeName')
    });
  },

  titleToken() {
    const model = this.modelFor('reviews');
    const name = get(model, 'user.name');
    return get(this, 'intl').t('titles.reviews', { user: name });
  },

  setHeadTags(model) {
    const description = get(model, 'content').substring(0, 140);
    return [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: description
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: `Review of ${get(model, 'media.canonicalTitle')}`
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
        content: get(model, 'media.posterImage.large')
      }
    }, {
      type: 'meta',
      tagId: 'meta-twitter-label1',
      attrs: {
        property: 'twitter:label1',
        content: 'Reviewed by'
      }
    }, {
      type: 'meta',
      tagId: 'meta-twitter-data1',
      attrs: {
        property: 'twitter:data1',
        content: get(model, 'user.name')
      }
    }, {
      type: 'meta',
      tagId: 'meta-twitter-label2',
      attrs: {
        property: 'twitter:label2',
        content: 'Rating'
      }
    }, {
      type: 'meta',
      tagId: 'meta-twitter-data2',
      attrs: {
        property: 'twitter:data2',
        content: `${get(model, 'rating')} out of 10`
      }
    }];
  }
});
