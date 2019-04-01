import { helper } from '@ember/component/helper';
import { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { htmlSafe } from '@ember/string';

export function userBadge([user]) {
  if (isPresent(get(user, 'title'))) {
    const title = get(user, 'title').toUpperCase();
    return htmlSafe(`<span class="tag tag-default role-tag">${title}</span>`);
  } if (get(user, 'isPro')) {
    const tier = get(user, 'proTier');
    return htmlSafe(`<span class="tag tag-default role-tag role-tag-${tier}">
      ${tier.toUpperCase()}
    </span>`);
  }
}

export default helper(userBadge);
