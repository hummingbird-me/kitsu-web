import Controller from 'ember-controller';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Controller.extend({
  session: service(),

  shouldShowOnboarding: computed('user.updatedAt', {
    get() {
      const user = get(this, 'user');
      return get(user, 'createdAt').getTime() === get(user, 'updatedAt').getTime();
    }
  })
});
