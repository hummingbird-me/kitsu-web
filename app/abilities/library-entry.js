import { Ability } from 'ember-can';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Ability.extend({
  /**
   * Can edit the library-entry if the user is the owner.
   */
  canEdit: computed('session.hasUser', 'model', 'user', function() {
    if (!get(this, 'session.hasUser')) { return false; }
    const user = get(this, 'user') || get(this, 'model.user');
    return get(this, 'session').isCurrentUser(user);
  }).readOnly()
});
