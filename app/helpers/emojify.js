import { helper } from 'ember-helper';
import { htmlSafe } from 'ember-string';
import emojione from 'emojione';

export function emojify([str]) {
  const emojified = emojione.toImage(str);
  return htmlSafe(emojified);
}

export default helper(emojify);
