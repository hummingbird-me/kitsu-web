import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

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
