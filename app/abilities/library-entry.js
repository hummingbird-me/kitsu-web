import { Ability } from 'ember-can';
import { get, computed } from '@ember/object';

export default Ability.extend({
  /**
   * Determines if the sessioned user is the owner of the library entry.
   *    (can "edit library-entry" <library-entry|user>)
   *
   * @returns {Boolean}
   */
  canEdit: computed('session.hasUser', 'model', 'user', function() {
    if (!get(this, 'session.hasUser')) { return false; }
    const user = get(this, 'user') || get(this, 'model.user') || get(this, 'model');
    return get(this, 'session').isCurrentUser(user);
  }).readOnly()
});
