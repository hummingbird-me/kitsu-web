import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import observer from 'ember-metal/observer';
import { task, timeout } from 'ember-concurrency';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import CoverPageMixin from 'client/mixins/routes/cover-page';
import errorMessages from 'client/utils/error-messages';
import clip from 'clip';

export default Route.extend(CanonicalRedirectMixin, CoverPageMixin, {
  templateName: 'media/show',
  metrics: service(),
  notify: service(),
  session: service(),

  saveEntryTask: task(function* (entry) {
    yield timeout(500);
    return yield entry.save()
      .then(() => get(this, 'notify').success('Your library entry was updated!'))
      .catch((err) => {
        entry.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
  }).restartable(),

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

  setupController(controller, model) {
    this._super(...arguments);
    if (get(this, 'session.hasUser') === true) {
      this._getLibraryEntry(controller, model);
    }
  },

  titleToken(model) {
    return get(model, 'computedTitle');
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  },

  _getLibraryEntry(controller, media) {
    const type = get(media, 'modelType');
    const promise = get(this, 'store').query('library-entry', {
      include: 'review',
      filter: {
        user_id: get(this, 'session.account.id'),
        kind: type,
        [`${type}_id`]: get(media, 'id')
      },
    }).then((results) => {
      const entry = get(results, 'firstObject');
      set(controller, 'entry', entry);
      if (entry !== undefined) {
        set(controller, `entry.${type}`, media);
      }
    });
    set(controller, 'entry', promise);
  },

  _headTags(model) {
    const desc = clip(get(model, 'synopsis'), 200);
    const data = [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: desc
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
        content: desc
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
      const rating = `${get(model, 'averageRating').toFixed(2)} out of 5`;
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
          content: rating
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

  // if the user authenticates while on this page, attempt to get their entry
  _userAuthenticated: observer('session.hasUser', function() {
    if (get(this, 'session.hasUser') === true) {
      this._getLibraryEntry(this.controllerFor(get(this, 'routeName')), this.modelFor(get(this, 'routeName')));
    }
  }),

  actions: {
    createEntry(status) {
      const controller = this.controllerFor(get(this, 'routeName'));
      const user = get(this, 'session.account');
      const media = this.modelFor(get(this, 'routeName'));
      const type = get(media, 'modelType');
      const entry = get(this, 'store').createRecord('library-entry', {
        status,
        user,
        [type]: media
      });
      return entry.save().then(() => set(controller, 'entry', entry)).catch((err) => {
        get(this, 'notify').error(errorMessages(err));
      });
    },

    updateEntry(entry, property, value) {
      set(entry, property, value);
      return entry.save().then(() => {
        get(this, 'notify').success('Your library entry was updated!');
      }).catch((err) => {
        entry.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
    },

    deleteEntry(entry) {
      const controller = this.controllerFor(get(this, 'routeName'));
      return entry.destroyRecord()
        .then(() => set(controller, 'entry', undefined))
        .catch((err) => {
          entry.rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    },

    saveEntryDebounced(entry) {
      get(this, 'saveEntryTask').perform(entry);
    }
  }
});
