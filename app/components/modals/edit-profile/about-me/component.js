import Component from 'ember-component';
import service from 'ember-service/inject';
import { alias } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';

export default Component.extend({
  selectedGender: undefined,
  i18n: service(),
  session: service(),
  user: alias('session.account'),

  init() {
    this._super(...arguments);
    this._setGenderOptions();
    this._setGender();
  },

  _setGenderOptions() {
    const keys = ['secret', 'male', 'female', 'custom'];
    const i18n = [];
    keys.forEach((key) => {
      const value = get(this, 'i18n').t(`users.edit.about.genderOptions.${key}`);
      i18n.push(value.string);
    });
    set(this, 'genderOptions', i18n);
  },

  _setGender() {
    const gender = get(this, 'user.gender');
    const options = get(this, 'genderOptions');

    if (isEmpty(gender) === true) {
      set(this, 'selectedGender', get(options, 'firstObject'));
    } else if (options.includes(gender) === true) {
      set(this, 'selectedGender', gender);
    } else {
      set(this, 'selectedGender', get(options, 'lastObject'));
    }
  },

  actions: {
    updateGender(value) {
      const options = get(this, 'genderOptions').slice(0, 2);
      if (options.includes(value) === true) {
        set(this, 'user.gender', value);
      }
      set(this, 'selectedGender', value);
    }
  }
});
