import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { classify } from 'ember-string';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  username: undefined,
  metrics: service(),
  notify: service(),
  session: service(),
  store: service(),

  createImport: task(function* () {
    const list = get(this, 'store').createRecord('list-import', {
      strategy: 1, // obliterate
      inputText: get(this, 'username'),
      kind: `ListImport::${classify(get(this, 'siteName'))}`,
      user: get(this, 'session.account')
    });
    return yield list.save();
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'siteName', get(this, 'componentData.siteName'));
  },

  actions: {
    changeComponent(component) {
      invokeAction(this, 'changeComponent', component, get(this, 'componentData'));
    },

    startImport() {
      get(this, 'createImport').perform()
        .then(() => {
          invokeAction(this, 'changeComponent', 'import-progress', get(this, 'componentData'));
          get(this, 'metrics').trackEvent({ category: 'import', action: 'create', label: get(this, 'siteName') });
        })
        .catch(err => get(this, 'notify').error(errorMessages(err)));
    }
  }
});
