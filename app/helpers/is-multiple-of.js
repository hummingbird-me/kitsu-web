import { helper } from 'ember-helper';

export function isMultipleOf([value, target]) {
  console.log(value, target);
  return value % target === 0;
}

export default helper(isMultipleOf);
