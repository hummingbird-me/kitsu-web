import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { CanMixin } from 'ember-can';
import RSVP from 'rsvp';
import errorMessages from 'client/utils/error-messages';

export default Component.extend(CanMixin, {
  notify: service(),
  store: service(),

  savePermissionsTask: task(function* () {
    const promises = [];
    get(this, 'leader.permissions').forEach(permission => {
      if (permission && get(permission, 'hasDirtyAttributes')) {
        promises.push(permission.save());
      }
    });
    yield RSVP.all(promises).then(() => {
      invokeAction(this, 'onSave');
      this._closeModal();
    }).catch(error => {
      get(this, 'notify').error(errorMessages(error));
    });
  }),

  actions: {
    closeModal() {
      const records = get(this, 'leader.permissions');
      records.forEach(record => {
        if (record && get(record, 'hasDirtyAttributes')) {
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
