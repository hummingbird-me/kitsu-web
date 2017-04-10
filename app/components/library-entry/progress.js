import Component from 'ember-component';
import get from 'ember-metal/get';
import computed, { alias } from 'ember-computed';
import { invoke, invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: '',
  media: alias('libraryEntry.media'),

  totalProgressText: computed('media.unitCount', function() {
    return get(this, 'media.unitCount') || '-';
  }).readOnly(),

  actions: {
    sanitizeNumber(value) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    },

    updateProgress(progress) {
      const sanitized = invoke(this, 'sanitizeNumber', progress);
      invokeAction(this, 'onProgressChange', sanitized);
    }
  }
});
