import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: '',
  readOnlyModal: false,

  hasReaction: computed('libraryEntry.mediaReaction', function() {
    const reaction = get(this, 'libraryEntry').belongsTo('mediaReaction').value();
    return reaction && get(reaction, 'isNew') === false;
  }),

  progressPercent: computed('libraryEntry.progress', function() {
    const progress = get(this, 'libraryEntry.progress');
    const unitCount = get(this, 'libraryEntry.media.unitCount');
    if (!progress || !unitCount) { return htmlSafe('width: 0%;'); }
    return htmlSafe(`width: ${(progress * 100) / unitCount}%;`);
  }).readOnly(),

  saveTask: task(function* () {
    const entry = get(this, 'libraryEntry');
    if (get(entry, 'validations.isValid') && get(entry, 'hasDirtyAttributes')) {
      try {
        yield invokeAction(this, 'saveEntry', entry);
      } catch (error) {
        entry.rollbackAttributes();
      }
    }
  }).restartable(),

  actions: {
    changeRating(rating) {
      set(this, 'libraryEntry.rating', rating);
      get(this, 'saveTask').perform();
    },

    saveEntry() {
      return get(this, 'saveTask').perform();
    }
  }
});
