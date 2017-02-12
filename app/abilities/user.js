import { Ability } from 'ember-can';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Ability.extend({
  canEdit: computed('session.hasUser', 'model', function() {
    if (!get(this, 'session.hasUser')) { return false; }
    const isOwner = get(this, 'session').isCurrentUser(get(this, 'model'));
    const isAdmin = get(this, 'session.account').hasRole('admin', get(this, 'model'));
    return isOwner || isAdmin;
  }).readOnly()
});
