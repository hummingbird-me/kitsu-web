import { helper } from '@ember/component/helper';
import { get } from '@ember/object';
import { dasherize } from '@ember/string';

/**
 * We check for comment as we currently push new comments into the same activity group as the
 * post and Stream has a soft limit of 15 on activities returned with the group, this pushes the
 * post out of the returned activities.
 */
export function feedType([activities]) {
  const activity = get(activities, 'firstObject');
  let [type] = get(activity, 'foreignId').split(':');
  type = type === 'Comment' ? 'post' : type;
  return dasherize(type);
}

export default helper(feedType);
