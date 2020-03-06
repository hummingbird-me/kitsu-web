import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { dasherize } from '@ember/string';
import { invokeAction } from 'ember-invoke-action';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  notify: service(),
  raven: service(),
  session: service(),
  store: service(),

  init() {
    this._super(...arguments);
    set(this, 'siteName', get(this, 'componentData.siteName'));
    set(this, 'exporter', this._createExporter());
  },

  createExport: task(function* () {
    yield get(this, 'exporter').save().then(() => {
      invokeAction(this, 'close');
      invokeAction(this, 'componentData.refresh');
    }).catch(error => {
      let statusCode = get(error, 'errors.firstObject.status');
      statusCode = parseInt(statusCode, 10);
      if (statusCode === 422) {
        get(this, 'notify').error('Authorization failed! Please check your username and password.');
      } else {
        get(this, 'notify').error(errorMessages(error));
        get(this, 'raven').captureException(error);
      }
    });
  }).drop(),

  _createExporter() {
    return get(this, 'store').createRecord('linked-account', {
      kind: dasherize(get(this, 'siteName')),
      syncTo: true,
      user: get(this, 'session.account')
    });
  }
});
