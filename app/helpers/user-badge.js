import Helper from 'ember-helper';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { htmlSafe } from 'ember-string';
import observer from 'ember-metal/observer';

export default Helper.extend({
  compute([user]) {
    set(this, 'user', user);
    const isPro = get(user, 'isPro');
    const isStaff = (get(user, 'content') || user).hasRole('admin');
    if (isStaff) {
      return htmlSafe('<span class="tag tag-default">STAFF</span>');
    } else if (isPro) {
      return htmlSafe('<span class="tag tag-default">PRO</span>');
    }
  },

  gotRoles: observer('user.userRoles.@each.role', function() {
    this.recompute();
  })
});
