import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['about-me-panel'],
  intl: service(),

  gender: computed('user.gender', function() {
    const gender = get(this, 'user.gender') || 'secret';
    if (['secret', 'male', 'female'].includes(gender)) {
      return get(this, 'intl').t(`users.activity.about.gender.${gender}`);
    }
    return gender;
  })
});
