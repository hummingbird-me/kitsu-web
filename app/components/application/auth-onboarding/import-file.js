import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { dasherize } from '@ember/string';
import { run } from '@ember/runloop';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  file: null,
  fileName: null,
  metrics: service(),
  notify: service(),
  store: service(),

  createImport: task(function* () {
    const list = get(this, 'store').createRecord('list-import', {
      strategy: 'greater',
      inputFile: get(this, 'file'),
      kind: `${dasherize(get(this, 'siteName'))}`,
      user: get(this, 'session.account')
    });
    return yield list.save();
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'siteName', get(this, 'componentData.siteName'));
  },

  actions: {
    triggerClick(elementId) {
      this.$(`#${elementId}`).click();
    },

    changeComponent(component) {
      invokeAction(this, 'changeComponent', component, get(this, 'componentData'));
    },

    updateFile(event) {
      if (event.files && event.files[0]) {
        set(this, 'fileName', event.files[0].name);
        const reader = new FileReader();
        reader.onload = evt => run(() => {
          set(this, 'file', evt.target.result);
        });
        reader.readAsDataURL(event.files[0]);
      }
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
