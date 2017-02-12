import { Ability } from 'ember-can';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Ability.extend({
  canView: computed('session.hasUser', 'model', function() {
    if (!get(this, 'session.hasUser')) { return false; }
    return get(this, 'session.account').hasRole('admin', get(this, 'model'));
  }).readOnly()
});
