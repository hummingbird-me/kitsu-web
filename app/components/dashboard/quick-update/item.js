import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { capitalize, htmlSafe } from '@ember/string';
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
  unitText: computed('isCompleted', 'entry.{progress,unit}', function() {
    // Completed?
    if (get(this, 'isCompleted')) {
      return get(this, 'intl').t('dashboard.quick-update.media.complete');
    }
    // No Progress?
    if (!get(this, 'entry.progress')) {
      return get(this, 'intl').t('dashboard.quick-update.media.unstarted');
    }
    // Current Unit
    const text = get(this, 'intl').t('dashboard.quick-update.media.unit', {
      type: get(this, 'entry.media.modelType'),
      num: get(this, 'entry.progress'),
      total: get(this, 'entry.media.unitCount')
    });
    // do we have the current unit information for this media?
    const unit = get(this, 'entry').belongsTo('unit').value();
    if (unit) {
      const title = get(this, 'entry.unit.canonicalTitle');
      const placeHolderTitle = `${capitalize(get(unit, 'modelType'))} ${get(unit, 'number')}`;
      if (title && title !== placeHolderTitle) {
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
