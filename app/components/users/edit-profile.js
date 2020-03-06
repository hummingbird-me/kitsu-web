import Component from '@ember/component';
import { get, set } from '@ember/object';
import { filterBy } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import RSVP from 'rsvp';

export default Component.extend({
  tab: 'about-me',
  router: service(),
  isDirty: filterBy('records', 'hasDirtyAttributes'),

  updateProfileTask: task(function* () {
    const records = get(this, 'records');
    const saving = records.filterBy('hasDirtyAttributes').map(record => record.save());
    return yield new RSVP.Promise((resolve, reject) => {
      RSVP.allSettled(saving).then(data => {
        const failed = data.filterBy('state', 'rejected');
        return failed.length > 0 ? reject(failed) : resolve();
      });
    });
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'records', []);
  },

  actions: {
    onClose() {
      get(this, 'records').filterBy('hasDirtyAttributes').forEach(record => {
        if (get(record, 'isNew') === false) {
          record.rollbackAttributes();
        }
      });
      invokeAction(this, 'onClose');
    },

    addRecord(record) {
      get(this, 'records').addObject(record);
    },

    removeRecord(record) {
      get(this, 'records').removeObject(record);
    },

    hideModal() {
      this.$('.modal').modal('hide');
    },

    transitionToSettings() {
      this.$('.modal').on('hidden.bs.modal', () => {
        get(this, 'router').transitionTo('settings');
      }).modal('hide');
    }
  }
});
