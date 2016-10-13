import Component from 'ember-component';
import service from 'ember-service/inject';
import { alias } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import { task, timeout } from 'ember-concurrency';

const GENDER_KEYS = ['secret', 'male', 'female', 'custom'];

export default Component.extend({
  selectedGender: undefined,
  i18n: service(),
  session: service(),
  store: service(),
  user: alias('session.account'),

  searchCharacters: task(function *() {
    yield timeout(1000);
    // TODO: Implement searching when available on server
  }).restartable(),

  init() {
    this._super(...arguments);
    this._setGenderOptions();
    this._setGender();
  },

  _setGenderOptions() {
    const i18n = [];
    GENDER_KEYS.forEach((key) => {
      i18n.push(this._translateGender(key));
    });
    set(this, 'genderOptions', i18n);
  },

  _setGender() {
    const gender = get(this, 'user.gender');

    if (isEmpty(gender) === true) {
      set(this, 'selectedGender', this._translateGender(get(GENDER_KEYS, 'firstObject')));
    } else if (GENDER_KEYS.includes(gender) === true) {
      set(this, 'selectedGender', this._translateGender(gender));
    } else {
      set(this, 'selectedGender', this._translateGender(get(GENDER_KEYS, 'lastObject')));
    }
  },

  _translateGender(key) {
    return get(this, 'i18n').t(`users.edit.about.genderOptions.${key}`).string;
  },

  actions: {
    updateGender(value) {
      const options = GENDER_KEYS.slice(0, 3).map((key) => {
        return { key, str: this._translateGender(key) };
      });
      if (options.map((o) => o.str).includes(value) === true) {
        set(this, 'user.gender', options.find((o) => o.str === value).key);
      }
      set(this, 'selectedGender', value);
    }
  }
});
