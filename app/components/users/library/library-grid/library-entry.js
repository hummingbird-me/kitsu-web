import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import createChangeset from 'ember-changeset-cp-validations';

export default Component.extend({
  tagName: '',
  readOnlyModal: false,

  hasReaction: computed('libraryEntry.mediaReaction', function() {
    const reaction = get(this, 'libraryEntry.mediaReaction');
    return reaction && get(reaction, 'isNew') === false;
  }),
  
  progressPercent: computed('libraryEntry.progress', function() {
    const progress = get(this, 'libraryEntry.progress');
    const unitCount = get(this, 'libraryEntry.media.unitCount');
    if (!progress || !unitCount) { return htmlSafe('width: 0%;'); }
    return htmlSafe(`width: ${(progress * 100) / unitCount}%;`);
  }).readOnly(),

  init() {
    this._super(...arguments);
    this.changeset = createChangeset(get(this, 'libraryEntry'));
  },

  saveTask: task(function* () {
    const changeset = get(this, 'changeset');
    yield changeset.validate();
    if (get(changeset, 'isValid') && get(changeset, 'isDirty')) {
      try {
        yield invokeAction(this, 'saveEntry', changeset);
      } catch (error) {
        changeset.rollback();
        get(this, 'libraryEntry').rollbackAttributes();
      }
    }
  }).restartable(),

  actions: {
    changeRating(rating) {
      set(this, 'changeset.rating', rating);
      get(this, 'saveTask').perform();
    },

    saveEntry(changeset) {
      const newChangeset = this.changeset.merge(changeset);
      set(this, 'changeset', newChangeset);
      return get(this, 'saveTask').perform();
    }
  }
});
