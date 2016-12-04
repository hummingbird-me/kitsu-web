import Ember from 'ember';

const DEFAULT_LENGTH = 50;
const DEFAULT_FUZZYNESS = 10;

export function truncateText(text, settings) {
  const input = text[0] || '';
  const length = settings.size || DEFAULT_LENGTH;
  const fuzzy = settings.fuzzyness || DEFAULT_FUZZYNESS;

  if (input.length <= length) return input;

  let end = input.indexOf(' ', length);
  if (end > (length + fuzzy) || end === -1) end = length;
  const final = input.substring(0, end);

  return `${final}...`;
}

export default Ember.Helper.helper(truncateText);
