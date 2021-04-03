import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  account: alias('model.taskInstance.value'),

  downloadUrl: computed('session.isAuthenticated', function () {
    const token = get(this, 'session.data.authenticated.access_token');

    return `/api/edge/library-entries/_xml?access_token=${token}`;
  }),

  animeDownloadUrl: computed('downloadUrl', function () {
    return `${this.downloadUrl}&kind=anime`;
  }),

  mangaDownloadUrl: computed('downloadUrl', function () {
    return `${this.downloadUrl}&kind=manga`;
  })
});
