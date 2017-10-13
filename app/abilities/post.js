import { Ability } from 'ember-can';
import { get, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Ability.extend({
  canWrite: readOnly('session.hasUser'),

  canEdit: computed('session.hasUser', 'model.user', function() {
    if (!get(this, 'session.hasUser')) { return false; }
    const isOwner = get(this, 'session').isCurrentUser(get(this, 'model.user'));
    const isAdmin = get(this, 'session.account').hasRole('admin', get(this, 'model'));
    return isOwner || isAdmin;
  }).readOnly()
});
