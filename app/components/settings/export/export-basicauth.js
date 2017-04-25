import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import { dasherize } from 'ember-string';
import errorMessages from 'client/utils/error-messages';
import computed from 'ember-computed';

export default Component.extend({
  username: undefined,
  password: undefined,
  notify: service(),
  session: service(),
  store: service(),

  token: computed('username', 'password', {
    get() {
      const username = get(this, 'username');
      const password = get(this, 'password');
      return btoa(`${username}:${password}`);
    }
  }).readOnly(),

  createExport: task(function* () {
    const exporter = get(this, 'store').createRecord('linked-account', {
      externalUserId: get(this, 'username'),
      token: get(this, 'password'),
      kind: dasherize(get(this, 'siteName')),
      syncTo: true,
      user: get(this, 'session.account')
    });

    try {
      yield exporter.save();
      this.sendAction('refresh');
      invokeAction(this, 'close');
    } catch (err) {
      const errorCode = parseInt(get(err, 'errors.firstObject.status'), 10);
      if (errorCode === 422) {
        get(this, 'notify').error('Authorization failed! Please check your username and password.');
      } else {
        get(this, 'notify').error(errorMessages(err));
        get(this, 'raven').captureException(err);
      }
      exporter.deleteRecord();
    }
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'siteName', get(this, 'componentData.siteName'));
  },

  actions: {
    setupExport() {
      get(this, 'createExport').perform();
    }
  }
});
