import Component from 'ember-component';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import moment from 'moment';

export default Component.extend({
  classNames: ['about-me-panel'],
  i18n: service(),

  age: computed('user.birthday', {
    get() {
      return moment.utc(new Date()).diff(moment.utc(get(this, 'user.birthday')), 'years');
    }
  }),

  gender: computed('user.gender', {
    get() {
      const gender = get(this, 'user.gender') || 'secret';
      const trans = get(this, 'i18n').t(`users.about.gender.${gender}`);
      if (trans.toString().includes('Missing translation')) {
        return gender;
      }
      return trans;
    }
  })
});
