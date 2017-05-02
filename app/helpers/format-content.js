import { helper } from 'ember-helper';
import { htmlSafe } from 'ember-string';
import format from 'client/utils/format-content';

export function formatContent([content], embed = true) {
  return htmlSafe(format(content, embed));
}

export default helper(formatContent);
