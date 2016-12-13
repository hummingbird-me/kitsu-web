import { helper } from 'ember-helper';

export function stripNamespace([text]) {
  return text.split('::')[1] || '';
}

export default helper(stripNamespace);
