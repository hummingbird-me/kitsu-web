import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { camelize } from '@ember/string';

export default Component.extend({
  tab: 'anime',

  normStats: computed('user.stats', function() {
    const stats = get(this, 'user.stats');
    return stats.reduce((acc, stat) => {
      const camelKind = camelize(get(stat, 'kind'));
      return { ...acc, [camelKind]: stat };
    }, {});
  }).readOnly()
});
