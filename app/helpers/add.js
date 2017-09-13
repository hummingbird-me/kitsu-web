import { helper } from 'ember-helper';

export function add(values) {
  return values.reduce((sum, value) => sum + value);
}

export default helper(add);
