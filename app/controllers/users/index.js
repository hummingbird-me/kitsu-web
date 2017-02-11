import Controller from 'ember-controller';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Controller.extend({
  shouldShowOnboarding: computed('user.updatedAt', function() {
    const user = get(this, 'user');
    return get(user, 'createdAt').getTime() === get(user, 'updatedAt').getTime();
  })
});
