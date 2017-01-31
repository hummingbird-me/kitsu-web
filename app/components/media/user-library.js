import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { task } from 'ember-concurrency';
import { capitalize } from 'ember-string';
import { strictInvokeAction } from 'ember-invoke-action';

export default Component.extend({
  isFavorite: false,
  store: service(),
  session: service(),

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

  totalProgressText: computed('media.unitCount', {
    get() {
      return get(this, 'media.unitCount') || '-';
    }
  }).readOnly(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getFavorite').perform().then((results) => {
      const record = get(results, 'firstObject');
      if (record) {
        set(this, 'favoriteRecord', record);
        set(this, 'isFavorite', true);
      }
    });
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

  actions: {
    sanitizeNumber(value) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    },

    update(property, value) {
      strictInvokeAction(this, 'update', get(this, 'entry'), property, value);
    },

    toggleFavorite() {
      if (get(this, 'getFavorite.isRunning')) { return; }
      if (get(this, 'isFavorite')) {
        this._destroyFavorite();
      } else {
        this._createFavorite();
      }
    }
  }
});
