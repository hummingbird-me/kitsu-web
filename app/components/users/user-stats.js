import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { camelize } from '@ember/string';

export default Component.extend({
  normStats: computed('user.stats', function() {
    const stats = get(this, 'user.stats');
    const normed = stats.reduce((acc, stat) => {
      const camelKind = camelize(get(stat, 'kind'));
      return { ...acc, [camelKind]: stat };
    }, {});

    if (normed.animeAmountConsumed && normed.animeAmountConsumed.statsData.time < 1) {
      delete normed.animeAmountConsumed;
    }
    if (normed.mangaAmountConsumed && normed.mangaAmountConsumed.statsData.units < 1) {
      delete normed.mangaAmountConsumed;
    }
    if (normed.animeCategoryBreakdown && normed.animeCategoryBreakdown.statsData.total < 1) {
      delete normed.animeCategoryBreakdown;
    }
    if (normed.mangaCategoryBreakdown && normed.mangaCategoryBreakdown.statsData.total < 1) {
      delete normed.mangaCategoryBreakdown;
    }
  }).readOnly()
});
