import { helper } from 'ember-helper';
import get from 'ember-metal/get';
import { isPresent } from 'ember-utils';
import { htmlSafe } from 'ember-string';

export function userBadge([user]) {
  const isPro = get(user, 'isPro');
  if (isPresent(get(user, 'title'))) {
    return htmlSafe('<span class="tag tag-default role-tag">STAFF</span>');
  } else if (isPro) {
    return htmlSafe('<span class="tag tag-default role-tag">PRO</span>');
  }
}

export default helper(userBadge);
