import moment from 'moment';

/**
 * Returns a humanized string from a moment duration object.
 *
 * @export
 * @param {any} duration
 */
export default function humanizeDuration(duration) {
  if (!moment.isDuration(duration)) { return; }
  let str = null;
  const types = ['years', 'months', 'weeks', 'days', 'hours', 'minutes'];
  types.forEach((type) => {
    const amount = duration.get(type);
    if (amount === 0) { return; }
    let humanized = `${amount} ${type}`;
    if (amount === 1) {
      humanized = humanized.slice(0, humanized.length - 1);
    }
    const pre = str ? `${str}, ` : '';
    str = `${pre}${humanized}`;
  });
  return str;
}
