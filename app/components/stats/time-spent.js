import Component from '@ember/component';
import { get, computed } from '@ember/object';
import moment from 'moment';

const UNITS = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];

export default Component.extend({
  stat: {},
  kind: 'anime',

  breakdown: computed('stat.time', function () {
    // Break down the duration into a list of constituent units
    const time = moment.duration(get(this, 'stat.time'), 'seconds');
    const breakdown = UNITS.map(unit => ({ name: unit, count: time.get(unit) }));
    // Pick the first three non-zero units
    return breakdown.filter(({ count }) => count > 0).slice(0, 3);
  }),

  primaryUnit: computed('stat.time', function () {
    const time = moment.duration(get(this, 'stat.time'), 'seconds');
    // Ideally we would use for..of but performance is still not good
    for (let i = 0; i < UNITS.length; i += 1) {
      const unitTime = time.as(UNITS[i]);
      if (unitTime > 1) {
        return { name: UNITS[i], count: unitTime };
      }
    }
  })
});
