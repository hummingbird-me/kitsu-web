import Component from '@ember/component';
import { get, computed } from '@ember/object';
import moment from 'moment';
import HoverIntentMixin from 'client/mixins/hover-intent';

const UNITS = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];

export default Component.extend(HoverIntentMixin, {
  hoverTimeout: 0,
  kind: 'anime',
  showTooltip: false,
  stat: {},

  breakdown: computed('stat.time', function () {
    const time = moment.duration(get(this, 'stat.time'), 'seconds');
    const breakdown = UNITS.map(unit => ({ name: unit, count: time.get(unit) }));
    return breakdown.slice(0, 5).filter(({ count }) => count > 0);
  }),

  primaryUnit: computed('stat.time', function () {
    if (get(this, 'kind') === 'anime') {
      const time = moment.duration(get(this, 'stat.time'), 'seconds');
      for (let i = 0; i < UNITS.length; i += 1) {
        const unitTime = time.as(UNITS[i]);
        if (unitTime > 1) {
          const index = i < 4 ? 4 - i : 1;
          return { index, name: UNITS[i], count: unitTime };
        }
      }
    } else {
      const chapters = get(this, 'stat.units');
      if (chapters > 15000) return { index: 4, count: chapters };
      if (chapters > 5000) return { index: 3, count: chapters };
      if (chapters > 1000) return { index: 2, count: chapters };
      return { index: 1, count: chapters };
    }
  }),

  percentile: computed('kind', 'stat.percentiles', function() {
    const kind = get(this, 'kind');
    const percentile = kind === 'anime'
      ? get(this, 'stat.percentiles.time')
      : get(this, 'stat.percentiles.units');
    const percentage = percentile * 100;
    if (Number(percentage).toFixed(0) >= 100) {
      return 99;
    }
    return percentage;
  })
});
