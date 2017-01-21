import { helper } from 'ember-helper';
import { htmlSafe } from 'ember-string';
/* global emojione */

export function emojify([str]) {
  const emojified = emojione.toImage(str);
  return htmlSafe(emojified);
}

export default helper(emojify);
