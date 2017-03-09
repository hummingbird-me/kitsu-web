import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { CanMixin } from 'ember-can';
import RSVP from 'rsvp';

export default Component.extend(CanMixin, {
  store: service(),

  savePermissionsTask: task(function* () {
    const promises = [];
    get(this, 'leader.permissions').forEach((permission) => {
      if (get(permission, 'hasDirtyAttributes')) {
        promises.push(permission.save());
      }
    });
    yield RSVP.all(promises).then(() => {
      invokeAction(this, 'onSave');
      this._closeModal();
    });
  }),

  actions: {
    closeModal() {
      const records = get(this, 'leader.permissions');
      records.forEach((record) => {
        if (get(record, 'hasDirtyAttributes')) {
          record.rollbackAttributes();
        }
      });
      this._closeModal();
    },

    updatePermission(permission) {
      // does the permission exist?
      const record = get(this, 'leader.permissions').findBy('permission', permission);
      if (record) {
        if (get(record, 'hasDirtyAttributes')) {
          record.rollbackAttributes();
        } else {
          record.deleteRecord();
        }
      } else { // if not add it
        get(this, 'store').createRecord('group-permission', {
          permission,
          groupMember: get(this, 'leader')
        });
      }
    }
  },

  _closeModal() {
    this.$('.modal').modal('hide');
  }
});
