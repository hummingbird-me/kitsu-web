import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { LIBRARY_STATUSES } from 'client/models/library-entry';
import jQuery from 'jquery';

export default Component.extend({
  tagName: '',
  isReadOnly: false,

  isValid: computed('libraryEntry.hasDirtyAttributes', 'libraryEntry.validations.isValid', 'saveTask.isIdle', function() {
    return get(this, 'libraryEntry.hasDirtyAttributes') && get(this, 'libraryEntry.validations.isValid') &&
      get(this, 'saveTask.isIdle');
  }).readOnly(),

  init() {
    this._super(...arguments);
    this.statuses = LIBRARY_STATUSES;
    this.privacies = [
      { id: false, value: 'Public' },
      { id: true, value: 'Private' }
    ];
  },

  removeTask: task(function* () {
    yield invokeAction(this, 'removeEntry', get(this, 'libraryEntry'));
    jQuery('.modal').modal('hide');
  }).drop(),

  saveTask: task(function* () {
    yield invokeAction(this, 'saveEntry', get(this, 'libraryEntry'));
    jQuery('.modal').modal('hide');
  }).drop(),

  actions: {
    onClose() {
      const entry = get(this, 'libraryEntry');
      entry.rollbackAttributes();
      invokeAction(this, 'onClose');
    },

    sanitizeNumber(value) {
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? value : parsed;
    },

    selectUpdate(attribute, object) {
      set(this, `libraryEntry.${attribute}`, get(object, 'id'));
    },

    rewatch() {
      set(this, 'libraryEntry.reconsumeCount', get(this, 'libraryEntry.reconsumeCount') + 1);
      set(this, 'libraryEntry.progress', 0);
      set(this, 'libraryEntry.status', 'current');
    }
  }
});
