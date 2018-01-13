import Component from '@ember/component';
import { get, computed } from '@ember/object';
import moment from 'moment';

const UNITS = ['years', 'months', 'days', 'hours', 'minutes'];

export default Component.extend({
  time: 0,

  breakdown: computed('time', function () {
    // Break down the duration into a list of constituent units
    const time = moment.duration(get(this, 'time'), 'minutes');
    const breakdown = UNITS.map(unit => ({ name: unit, count: time[unit]() }));
    // Pick the first three non-zero units
    const nonzeroBreakdown = breakdown.filter(({ count }) => count > 0);
    return nonzeroBreakdown.slice(0, 3);
  })
});
