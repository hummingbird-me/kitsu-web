import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(CanonicalRedirectMixin, CoverPageMixin, {
  templateName: 'media/show',
  headData: service(),

  model({ slug }) {
    const [type] = get(this, 'routeName').split('.');
    let include = ['genres', 'mediaRelationships.destination'];
    if (type === 'anime') {
      include.push('animeProductions.producer');
    }
    include = include.join(',');
    if (slug.match(/\D+/)) {
      return get(this, 'store').query(type, { filter: { slug }, include })
        .then(records => get(records, 'firstObject'));
    }
    return get(this, 'store').findRecord(type, slug, { include });
  },

  afterModel(model) {
    set(this, 'breadcrumb', get(model, 'canonicalTitle'));
  },

  setupController(controller, model) {
    this._super(...arguments);
    // add structured data for this route
    const head = get(this, 'headData');
    const data = this._schemaData(model);
    set(head, 'structuredData.media-show', data);
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  },

  /**
   * Meta tags with ember-cli-meta-tags
   */
  _headTags(model) {
    const data = [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: get(model, 'synopsis')
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
        content: get(model, 'synopsis')
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-image',
      attrs: {
        property: 'og:image',
        content: get(model, 'posterImage.large')
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
          content: `${get(model, 'averageRating')} out of 10`
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
   */
  _schemaData(model) {
    const data = {
      '@context': 'http://schema.org',
      '@type': 'CreativeWorkSeries',
      name: get(model, 'canonicalTitle'),
      alternateName: Object.values(get(model, 'titles'))
        .reject(title => title === get(model, 'canonicalTitle')),
      description: get(model, 'synopsis'),
      image: get(model, 'posterImage.large'),
      genre: get(model, 'genres').mapBy('name')
    };

    if (get(model, 'averageRating')) {
      data.aggregateRating = {
        '@type': 'AggregateRating',
        bestRating: 10,
        worstRating: 1,
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
