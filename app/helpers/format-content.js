import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import format from 'client/utils/format-content';

export function formatContent([content]) {
  return htmlSafe(format(content));
}

export default helper(formatContent);
