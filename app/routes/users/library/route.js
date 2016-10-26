import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { capitalize } from 'ember-string';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { invoke } from 'ember-invoke-action';
import libraryStatus from 'client/utils/library-status';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  queryParams: {
    media: { refreshModel: true },
    status: { refreshModel: true }
  },
  i18n: service(),
  metrics: service(),
  session: service(),

  /**
   * Restartable task that queries the library entries for the current status,
   * and media type.
   */
  modelTask: task(function* (media, status) {
    const user = this.modelFor('users');
    const userId = get(user, 'id');
    const options = {};

    if (status === 'all') {
      status = '1,2,3,4,5'; // eslint-disable-line no-param-reassign
      Object.assign(options, { sort: 'status' });
    } else {
      // eslint-disable-next-line no-param-reassign
      status = libraryStatus.enumToNumber(status);
    }

    Object.assign(options, {
      include: 'media.genres,user',
      filter: {
        user_id: userId,
        media_type: capitalize(media),
        status
      },
      page: { offset: 0, limit: 50 }
    });
    return yield get(this, 'store').query('library-entry', options);
  }).restartable(),

  model({ media, status }) {
    return get(this, 'modelTask').perform(media, status);
  },

  afterModel(model) {
    this._trackImpression(model);
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'user', this.modelFor('users'));
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'i18n').t('titles.users.library', { user: name });
  },

  _trackImpression(model) {
    const controller = this.controllerFor(get(this, 'routeName'));
    const list = model.map(entry => ({
      foreign_id: `LibraryEntry:${get(entry, 'id')}`,
      actor: {
        id: `User:${get(this, 'session.account.id')}`,
        label: get(this, 'session.account.name')
      },
      verb: 'view',
      object: {
        id: `${capitalize(get(controller, 'media'))}:${get(entry, 'media.id')}`,
        label: get(entry, 'media.canonicalTitle')
      }
    }));
    get(this, 'metrics').invoke('trackImpression', 'Stream', {
      content_list: list,
      location: get(this, 'routeName')
    });
  },

  actions: {
    saveEntry(entry) {
      if (get(entry, 'validations.isValid') === true) {
        return entry.save()
          .then(() => {})
          .catch(() => entry.rollbackAttributes());
      }
    },

    deleteEntry(entry) {
      return entry.destroyRecord()
        .then(() => {})
        .catch(() => entry.rollbackAttributes());
    }
  }
});
