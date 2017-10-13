import { helper } from '@ember/component/helper';
import { typeOf } from '@ember/utils';

export function isPromise([promise]) {
  return !promise ? false : typeOf(promise.then) === 'function';
}

export default helper(isPromise);
