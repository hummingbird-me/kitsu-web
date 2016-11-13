import { helper } from 'ember-helper';
import moment from 'moment';

export function momentUtc([time]) {
  return moment.utc(time);
}

export default helper(momentUtc);
