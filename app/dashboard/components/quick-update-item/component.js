import Component from 'ember-component';
import { task } from 'ember-concurrency';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import getter from 'client/utils/getter';
import { modelType } from 'client/helpers/model-type';

const QuickUpdateItemComponent = Component.extend({
  i18n: service(),

  isAnime: getter(function() {
    return modelType([get(this, 'entry.media')]) === 'anime';
  }),

  unitType: getter(function() {
    return get(this, 'isAnime') === true ? 'episode' : 'chapter';
  }),

  isCompleted: computed('entry.status', {
    get() {
      return get(this, 'entry.status') === 'completed';
    }
  }).readOnly(),

  nextProgress: computed('entry.progress', {
    get() {
      const progress = get(this, 'entry.progress');
      return progress === get(this, 'entry.media.unitCount') ? progress : progress + 1;
    }
  }).readOnly(),

  canComplete: computed('nextProgress', {
    get() {
      return get(this, 'nextProgress') === get(this, 'entry.media.unitCount');
    }
  }).readOnly(),

  episodeText: computed('nextProgress', {
    get() {
      const num = get(this, 'nextProgress');
      const key = get(this, 'unitType');
      const start = get(this, 'i18n').t(`dashboard.quickUpdate.${key}`, { num });
      // TODO: If we have the episode data, then append the `- Episode Title`.
      return start;
    }
  }).readOnly(),

  updateEntryTask: task(function* () {
    const entry = get(this, 'entry');
    const progress = get(entry, 'progress');

    if (get(this, 'canComplete') === true) {
      set(entry, 'status', 'completed');
    }
    if (get(this, 'nextProgress') !== progress) {
      set(entry, 'progress', progress + 1);
    }
    // TODO: Feedback on error
    yield entry.save().catch(() => {});
  }).enqueue(),

  actions: {
    rateEntry(rating) {
      const entry = get(this, 'entry');
      set(entry, 'rating', rating);
      // TODO: Feedback on error
      entry.save().catch(() => {});
    }
  }
});

QuickUpdateItemComponent.reopenClass({
  positionalParams: ['entry']
});

export default QuickUpdateItemComponent;
