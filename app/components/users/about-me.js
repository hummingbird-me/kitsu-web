import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  classNames: ['about-me-panel'],

  gender: computed('user.gender', function() {
    const gender = get(this, 'user.gender') || 'secret';
    const trans = get(this, 'intl').t(`users.activity.about.gender.${gender}`);
    if (trans.toString().includes('Missing translation')) {
      return gender;
    }
    return trans;
  })
});
