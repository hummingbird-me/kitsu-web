import { helper } from 'ember-helper';
import jQuery from 'jquery';

export function isPromise([promise]) {
  return promise === undefined ? false : jQuery.isFunction(promise.then);
}

export default helper(isPromise);
