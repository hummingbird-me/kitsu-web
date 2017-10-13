import { helper } from '@ember/component/helper';

export function isMultipleOf([value, target]) {
  return value % target === 0;
}

export default helper(isMultipleOf);
