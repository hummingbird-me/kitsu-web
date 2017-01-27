import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Component.extend({
  i18n: service(),
  session: service(),

  // Returns the i18n version of our status
  statusName: computed('status', {
    get() {
      const status = get(this, 'status');
      const mediaType = get(this, 'mediaType');
      return get(this, 'i18n').t(`library.statuses.${mediaType}.${status}`);
    }
  }),

  // Displays the number of entries within this section
  stats: computed('entries', {
    get() {
      const entries = get(this, 'entries');
      let count = entries !== undefined ? get(entries, 'meta.count') : 0;
      count = count === undefined ? 0 : count;
      const text = count === 1 ? 'title' : 'titles';
      return `${count} ${text}`;
    }
  })
});
