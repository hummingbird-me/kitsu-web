import { typeOf, isEmpty } from '@ember/utils';

export function serializeArray(value) {
  const isRange = typeOf(value[0]) !== 'string';
  if (isRange && value.length === 2) {
    return value.join('..');
  } if (!isRange && value.length > 1) {
    return value.reject(x => isEmpty(x)).join();
  }
  return value.join();
}

export function deserializeArray(value) {
  const isRange = value.includes('..');
  if (isRange) {
    return value.split('..').map(x => {
      if (isEmpty(x)) { return ''; }
      if (Number.isInteger(JSON.parse(x))) {
        return parseInt(x, 10);
      }
      return parseFloat(x);
    });
  }
  return value.split(',');
}

export default { serializeArray, deserializeArray };
