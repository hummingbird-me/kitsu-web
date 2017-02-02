import { helper } from 'ember-helper';
import { typeOf } from 'ember-utils';

export function isPromise([promise]) {
  return promise === undefined ? false : typeOf(promise.then) === 'function';
}

export default helper(isPromise);
