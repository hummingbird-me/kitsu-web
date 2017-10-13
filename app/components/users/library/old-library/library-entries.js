import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl: service(),

  // Returns the intl version of our status
  statusName: computed('status', function() {
    const status = get(this, 'status');
    const type = get(this, 'mediaType');
    return get(this, 'intl').t(`library-shared.${status}`, { type });
  }),

  // Displays the number of entries within this section
  stats: computed('metaCount', function() {
    const count = get(this, 'metaCount') || 0;
    const text = count === 1 ? 'title' : 'titles';
    return count ? `${count} ${text}` : '';
  })
});
