import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

export default Component.extend({
  classNames: ['media-sidebar'],
  isFavorite: false,
  store: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'session.hasUser')) {
      get(this, 'getFavorite').perform().then((results) => {
        const record = get(results, 'firstObject');
        if (record) {
          set(this, 'favoriteRecord', record);
          set(this, 'isFavorite', true);
        }
      }).catch((error) => {
        get(this, 'raven').captureException(error);
      });
    }

    if (get(this, 'media.modelType') === 'anime') {
      get(this, 'getStreamersTask').perform();
    }
  },

  getFavorite: task(function* () {
    const mediaType = get(this, 'media.modelType');
    const mediaId = get(this, 'media.id');
    return yield get(this, 'store').query('favorite', {
      filter: {
        item_type: capitalize(mediaType),
        item_id: mediaId,
        user_id: get(this, 'session.account.id')
      }
    });
  }).restartable(),

  getStreamersTask: task(function* () {
    const media = get(this, 'media');
    const streamingLinks = media.hasMany('streamingLinks');
    if (streamingLinks.value()) {
      return yield RSVP.all(streamingLinks.value().map(streamingLink => (
        streamingLink.belongsTo('streamer').load()
      )));
    }
    return yield streamingLinks.load().then(records => (
      RSVP.all(records.map(record => record.belongsTo('streamer').load()))
    ));
  }).restartable(),

  actions: {
    toggleFavorite() {
      if (!get(this, 'session.hasUser')) {
        get(this, 'session').signUpModal();
      }

      if (get(this, 'getFavorite.isRunning')) { return; }
      if (get(this, 'isFavorite')) {
        this._destroyFavorite();
      } else {
        this._createFavorite();
      }
    }
  },

  _createFavorite() {
    const record = get(this, 'store').createRecord('favorite', {
      item: get(this, 'media'),
      user: get(this, 'session.account')
    });
    set(this, 'isFavorite', true);
    record.save().then(() => {
      set(this, 'favoriteRecord', record);
    }).catch(() => {
      set(this, 'isFavorite', false);
    });
  },

  _destroyFavorite() {
    set(this, 'isFavorite', false);
    get(this, 'favoriteRecord').destroyRecord().catch(() => {
      set(this, 'isFavorite', true);
    });
  },
});
