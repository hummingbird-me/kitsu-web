import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(CanonicalRedirectMixin, CoverPageMixin, {
  templateName: 'media/show',
  head: service('head-data'),
  queryCache: service(),

  model({ slug }) {
    const [type] = get(this, 'routeName').split('.');
    let include = ['categories'];
    if (type === 'anime') {
      include.push('animeProductions.producer');
    }
    include = include.join(',');
    if (slug.match(/\D+/)) {
      return get(this, 'queryCache').query(type, {
        filter: { slug },
        fields: { categories: 'slug,title' },
        include
      }).then(records => get(records, 'firstObject'));
    }
    return get(this, 'store').findRecord(type, slug, { include, reload: true });
  },

  afterModel(model) {
    if (model) {
      set(this, 'breadcrumb', get(model, 'canonicalTitle'));
    }
  },

  setupController(controller, model) {
    this._super(...arguments);

    // add structured data for this route
    const head = get(this, 'head');
    const data = this.setStructuredData(model);
    set(head, 'structuredData.media-show', data);
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  },

  titleToken(model) {
    return get(model, 'computedTitle');
  },

  /**
   * Meta tags with ember-cli-meta-tags
   *
   * @param {Object} model
   * @returns {Array}
   */
  setHeadTags(model) {
    const data = [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: get(model, 'description')
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: get(model, 'canonicalTitle')
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: get(model, 'description')
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-image',
      attrs: {
        property: 'og:image',
        content: get(model, 'posterImage.tiny')
      }
    }];

    if (get(model, 'averageRating')) {
      data.push({
        type: 'meta',
        tagId: 'meta-twitter-label1',
        attrs: {
          property: 'twitter:label1',
          content: 'Average rating'
        }
      }, {
        type: 'meta',
        tagId: 'meta-twitter-data1',
        attrs: {
          property: 'twitter:data1',
          content: `${get(model, 'averageRating')}%`
        }
      }, {
        type: 'meta',
        tagId: 'meta-twitter-label2',
        attrs: {
          property: 'twitter:label2',
          content: 'Total ratings'
        }
      }, {
        type: 'meta',
        tagId: 'meta-twitter-data2',
        attrs: {
          property: 'twitter:data2',
          content: get(model, 'totalRatings').toLocaleString()
        }
      });
    }
    return data;
  },

  /**
   * Structured data with ember-cli-head
   *
   * @param {Object} model
   * @returns {Object}
   */
  setStructuredData(model) {
    const data = {
      '@context': 'http://schema.org',
      '@type': 'CreativeWorkSeries',
      name: Object.values(get(model, 'titles')).uniq(),
      description: get(model, 'description'),
      image: get(model, 'posterImage.large'),
      genre: get(model, 'categories').mapBy('title')
    };

    if (get(model, 'averageRating')) {
      data.aggregateRating = {
        '@type': 'AggregateRating',
        bestRating: 100,
        worstRating: 5,
        ratingValue: get(model, 'averageRating'),
        ratingCount: get(model, 'totalRatings')
      };
    }

    if (get(model, 'startDate')) {
      data.startDate = get(model, 'startDate').format('YYYY-MM-DD');
    }

    if (get(model, 'endDate')) {
      data.endDate = get(model, 'endDate').format('YYYY-MM-DD');
    }
    return data;
  }
});
