import { helper } from 'ember-helper';

export function decimalNumber([number, precision = 1]) {
  return Number(number || 0).toFixed(precision);
}

export default helper(decimalNumber);
