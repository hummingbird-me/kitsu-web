import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import createChangeset from 'ember-changeset-cp-validations';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { LIBRARY_STATUSES } from 'client/models/library-entry';
import jQuery from 'jquery';

export default Component.extend({
  tagName: '',
  isReadOnly: false,

  isValid: computed('changeset.{isDirty,isValid}', 'saveTask.isIdle', function() {
    return get(this, 'changeset.isDirty') && get(this, 'changeset.isValid') &&
      get(this, 'saveTask.isIdle');
  }).readOnly(),

  init() {
    this._super(...arguments);
    this.changeset = createChangeset(get(this, 'libraryEntry'));
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
    yield invokeAction(this, 'saveEntry', get(this, 'changeset'));
    jQuery('.modal').modal('hide');
  }).drop(),

  actions: {
    sanitizeNumber(value) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    },

    selectUpdate(attribute, object) {
      set(this, `changeset.${attribute}`, get(object, 'id'));
    },

    rewatch() {
      set(this, 'changeset.reconsumeCount', get(this, 'changeset.reconsumeCount') + 1);
      set(this, 'changeset.progress', 0);
      set(this, 'changeset.status', 'current');
    },

    updateNotes(content) {
      set(this, 'changeset.notes', content);
    }
  }
});
