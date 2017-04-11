import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed, { equal } from 'ember-computed';
import service from 'ember-service/inject';
import { htmlSafe } from 'ember-string';
import { task } from 'ember-concurrency';
import { strictInvokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['quick-update-item'],
  intl: service(),
  store: service(),
  isCompleted: equal('entry.status', 'completed').readOnly(),

  nextProgress: computed('entry.progress', function() {
    const progress = get(this, 'entry.progress');
    const total = get(this, 'entry.media.unitCount');
    return progress === total ? progress : progress + 1;
  }).readOnly(),

  canComplete: computed('nextProgress', function() {
    return get(this, 'nextProgress') === get(this, 'entry.media.unitCount');
  }).readOnly(),

  /**
   * Get the translated subtext for the quick update item
   */
  episodeText: computed('isCompleted', 'nextProgress', 'entry.nextUnit', function() {
    // Completed?
    if (get(this, 'isCompleted')) {
      return get(this, 'intl').t('dashboard.quick-update.media.complete');
    }
    const text = get(this, 'intl').t('dashboard.quick-update.media.episode', {
      type: get(this, 'entry.media.modelType'),
      num: get(this, 'nextProgress'),
      total: get(this, 'entry.media.unitCount')
    });
    // do we have the next unit information for this entry?
    const nextUnit = get(this, 'entry').belongsTo('nextUnit').value();
    if (nextUnit) {
      const title = get(this, 'entry.nextUnit.canonicalTitle');
      if (title) {
        return `${text} - ${title}`;
      }
    }
    return text;
  }).readOnly(),

  completedPercent: computed('entry.progress', function() {
    const progress = get(this, 'entry.progress');
    const total = get(this, 'entry.media.unitCount');
    const result = ((progress / total) * 100).toFixed(2);
    return htmlSafe(`width: ${result}%;`);
  }).readOnly(),

  updateEntryTask: task(function* (rating) {
    const hash = { progress: get(this, 'nextProgress') };
    if (typeof rating === 'number') {
      set(hash, 'rating', rating);
    }
    // will the next update complete this media?
    if (get(this, 'canComplete')) {
      hash.status = 'completed';
    }
    yield strictInvokeAction(this, 'updateEntry', hash);
    yield strictInvokeAction(this, 'reloadUnit');
  }).drop()
});
