import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import { task } from 'ember-concurrency';
import getter from 'client/utils/getter';
import errorMessages from 'client/utils/error-messages';
import COUNTRIES from 'client/utils/countries';
import moment from 'moment';

export default Controller.extend({
  notify: service(),
  session: service(),
  user: alias('session.account'),

  languages: getter(() => [{ id: 'en', text: 'English' }]),
  timezoneGuess: getter(() => moment.tz.guess()),
  timezones: getter(() => moment.tz.names()),
  countries: getter(() => (
    Object.keys(COUNTRIES).map(key => ({ id: key, text: COUNTRIES[key] })).sortBy('text')
  )),
  titles: getter(() => ['Canonical', 'Romanized', 'English'].map(key => (
    { id: key.toLowerCase(), text: key }
  ))),
  filters: getter(() => (
    [{ value: true, text: 'Hide Adult Content' },
    { value: false, text: 'Show Adult Content (¬‿¬ )' }]
  )),

  isValid: computed('username', 'user.hasDirtyAttributes', 'user.name', {
    get() {
      if (get(this, 'user.hasDirtyAttributes')) { return true; }
      return get(this, 'user.name') !== get(this, 'username');
    }
  }).readOnly(),

  updateProfile: task(function* () {
    set(this, 'user.name', get(this, 'username'));
    yield get(this, 'user').save()
      .then(() => get(this, 'notify').success('Your profile was updated.'))
      .catch((err) => {
        get(this, 'notify').error(errorMessages(err));
        get(this, 'user').rollbackAttributes();
        set(this, 'username', get(this, 'user.name'));
      });
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'username', get(this, 'user.name'));
  }
});
