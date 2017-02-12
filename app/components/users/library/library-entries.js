import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';

export default Component.extend({
  // Returns the intl version of our status
  statusName: computed('status', function() {
    const status = get(this, 'status');
    const type = get(this, 'mediaType');
    return get(this, 'intl').t(`library-shared.${status}`, { type });
  }),

  // Displays the number of entries within this section
  stats: getter(function() {
    const entries = get(this, 'entries');
    const count = entries !== undefined ? get(entries, 'meta.count') : 0;
    const text = count === 1 ? 'title' : 'titles';
    return count ? `${count} ${text}` : '';
  })
});
