import { helper } from 'ember-helper';
import get from 'ember-metal/get';
import { dasherize } from 'ember-string';

export function feedType([activities]) {
  const activity = get(activities, 'firstObject');
  const [type] = get(activity, 'foreignId').split(':');
  return dasherize(type);
}

export default helper(feedType);

