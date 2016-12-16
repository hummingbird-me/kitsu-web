import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { capitalize } from 'ember-string';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { storageFor } from 'ember-local-storage';
import libraryStatus from 'client/utils/library-status';
import PaginationMixin from 'client/mixins/routes/pagination';
import errorMessages from 'client/utils/error-messages';

export default Route.extend(PaginationMixin, {
  queryParams: {
    media: { refreshModel: true },
    status: { refreshModel: true }
  },

  i18n: service(),
  notify: service(),
  metrics: service(),
  session: service(),
  lastUsed: storageFor('last-used'),

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
      Object.assign(options, { sort: 'status,-updated_at' });
    } else {
      // eslint-disable-next-line no-param-reassign
      status = libraryStatus.enumToNumber(status);
      Object.assign(options, { sort: '-updated_at' });
    }

    Object.assign(options, {
      include: 'media,user',
      filter: {
        user_id: userId,
        media_type: capitalize(media),
        status
      },
      page: { offset: 0, limit: 200 }
    });
    return yield get(this, 'store').query('library-entry', options).then((results) => {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'taskValue', results);
      return results;
    });
  }).restartable(),

  beforeModel({ queryParams }) {
    if (queryParams.media === undefined) {
      if (get(this, 'session').isCurrentUser(this.modelFor('users'))) {
        const type = get(this, 'lastUsed.libraryType');
        if (type) {
          this.replaceWith({ queryParams: { media: type } });
        }
      }
    }
  },

  model({ media, status }) {
    return { taskInstance: get(this, 'modelTask').perform(media, status) };
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

  actions: {
    saveEntry(entry) {
      if (get(entry, 'validations.isValid') === true) {
        return entry.save()
          .then(() => get(this, 'notify').success('Your library entry was updated!'))
          .catch((err) => {
            entry.rollbackAttributes();
            get(this, 'notify').error(errorMessages(err));
          });
      }
    },

    deleteEntry(entry) {
      return entry.destroyRecord()
        .catch((err) => {
          entry.rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    }
  }
});
