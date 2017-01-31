import Component from 'ember-component';
import { task } from 'ember-concurrency';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { isPresent } from 'ember-utils';
import service from 'ember-service/inject';
import getter from 'client/utils/getter';
import errorMessages from 'client/utils/error-messages';

const QuickUpdateItemComponent = Component.extend({
  i18n: service(),
  notify: service(),

  isAnime: getter(function() {
    return get(this, 'entry.media.modelType') === 'anime';
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

  episodeText: computed('nextProgress', 'entry.nextUnit', {
    get() {
      const num = get(this, 'nextProgress');
      const key = get(this, 'unitType');
      let text = get(this, 'i18n').t(`dashboard.quickUpdate.${key}`, { num });
      if (isPresent(get(this, 'entry.nextUnit.content'))) {
        const title = get(this, 'entry.nextUnit.canonicalTitle');
        if (isPresent(title)) {
          text = `${text} – ${title}`;
        }
      }
      return text;
    }
  }).readOnly(),

  updateEntryTask: task(function* () {
    if (get(this, 'isDragging')) { return; }

    const entry = get(this, 'entry');
    const progress = get(entry, 'progress');
    if (get(this, 'canComplete') === true) {
      set(entry, 'status', 'completed');
      // load in review
      yield get(entry, 'review');
    }
    if (get(this, 'nextProgress') !== progress) {
      set(entry, 'progress', progress + 1);
    }
    yield entry.save().then(() => {
      const idWas = get(entry, 'nextUnit.id');
      entry.belongsTo('nextUnit').reload().then((unit) => {
        // unit will be the old value if reload returns null.
        if (get(unit, 'id') === idWas) {
          set(entry, 'nextUnit', null);
        } else {
          set(entry, 'nextUnit', unit);
        }
      }).catch(() => set(entry, 'nextUnit', null));
    }).catch((err) => {
      entry.rollbackAttributes();
      get(this, 'notify').error(errorMessages(err));
    });
  }).enqueue(),

  actions: {
    rateEntry(rating) {
      const entry = get(this, 'entry');
      set(entry, 'rating', rating);
      entry.save().catch((err) => {
        entry.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
    }
  }
});

QuickUpdateItemComponent.reopenClass({
  positionalParams: ['entry']
});

export default QuickUpdateItemComponent;
