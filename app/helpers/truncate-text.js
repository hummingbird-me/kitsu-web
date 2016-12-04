import { helper } from 'ember-helper';

export function truncateText([text = ''], { size = 50, fuzzyness = 10 }) {
  if (text.length <= size) return text;

  let end = text.indexOf(' ', size);
  if (end > (size + fuzzyness) || end === -1) end = size;
  const final = text.substring(0, end);

  return `${final}...`;
}

export default helper(truncateText);
