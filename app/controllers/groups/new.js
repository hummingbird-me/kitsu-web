import Controller from 'ember-controller';
import get from 'ember-metal/get';
import computed, { alias } from 'ember-computed';
import { isBlank } from 'ember-utils';

export default Controller.extend({
  addedTags: [],
  isSaving: false,
  group: alias('model'),

  /** Determines if the submit button is disabled/enabled. */
  isValid: computed('group.validations.isValid', 'isSaving', function() {
    return get(this, 'group.validations.isValid') && !get(this, 'isSaving');
  }).readOnly(),

  actions: {
    /**
     * Allow creating a tag from user input with ember-power-select-multiple.
     *
     * @param {Ember.Component} select
     * @param {Event} event
     */
    createTag(select, event) {
      if (event.keyCode === 13) {
        // power-select valid
        if (!select.isOpen || select.isHighlighted || isBlank(select.searchText)) {
          return;
        }
        const selected = get(this, 'group.tags') || [];
        if (!selected.includes(select.searchText)) {
          get(this, 'addedTags').addObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    }
  }
});
