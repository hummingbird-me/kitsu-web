import Controller from '@ember/controller';
import { get, computed } from '@ember/object';

export default Controller.extend({
  shouldShowOnboarding: computed('user.updatedAt', function() {
    const user = get(this, 'user');
    return get(user, 'createdAt').getTime() === get(user, 'updatedAt').getTime();
  })
});
