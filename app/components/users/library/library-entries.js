import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import getter from 'client/utils/getter';

export default Component.extend({
  i18n: service(),

  // Returns the i18n version of our status
  statusName: computed('status', {
    get() {
      const status = get(this, 'status');
      const mediaType = get(this, 'mediaType');
      return get(this, 'i18n').t(`library.statuses.${mediaType}.${status}`);
    }
  }),

  // Displays the number of entries within this section
  stats: getter(function() {
    const entries = get(this, 'entries');
    const count = entries !== undefined ? get(entries, 'meta.count') : 0;
    const text = count === 1 ? 'title' : 'titles';
    return count ? `${count} ${text}` : '';
  })
});
