import Controller from '@ember/controller';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { storageFor } from 'ember-local-storage';
import getter from 'client/utils/getter';
import errorMessages from 'client/utils/error-messages';
import COUNTRIES from 'client/utils/countries';
import { LANGUAGES } from 'client/utils/languages';
import momentLocale from 'client/utils/languages-moment';
import config from 'client/config/environment';
import moment from 'moment';

export default Controller.extend({
  notify: service(),
  lastUsed: storageFor('last-used'),
  user: alias('session.account'),
  languages: getter(() => LANGUAGES.sortBy('text')),
  currentLanguage: alias('intl.primaryLocale'),
  timezoneGuess: getter(() => moment.tz.guess()),
  timezones: getter(() => moment.tz.names()),
  intl: service(),
  moment: service(),

  countries: getter(() => (
    Object.keys(COUNTRIES).map(key => ({ id: key, text: COUNTRIES[key] })).sortBy('text')
  )),

  titles: getter(() => (
    ['Canonical', 'Romanized', 'English'].map(key => ({ id: key.toLowerCase(), text: key }))
  )),

  themes: getter(() => (
    ['Light Theme', 'Dark Theme'].map(key => ({ id: key.split(' ')[0].toLowerCase(), text: key }))
  )),

  ratings: getter(() => (
    ['Simple', 'Regular', 'Advanced'].map(key => ({ id: key.toLowerCase(), text: key }))
  )),

  filters: getter(() => (
    [
      { value: 'sfw', text: 'Hide All Adult Content (❁´◡`❁)' },
      { value: 'nsfw_sometimes', text: 'Limit to Following Feed (¬‿¬ )' },
      { value: 'nsfw_everywhere', text: 'Adult Content Everywhere (⓿_⓿)' },
    ]
  )),

  isValid: computed('user.hasDirtyAttributes', 'name', 'user.name', 'slug', 'user.slug', function() {
    if (get(this, 'user.hasDirtyAttributes')) { return true; }
    return get(this, 'user.name') !== get(this, 'name')
           || get(this, 'user.slug') !== get(this, 'slug');
  }).readOnly(),

  updateProfile: task(function* () {
    set(this, 'user.name', get(this, 'name'));
    set(this, 'user.slug', get(this, 'slug'));
    yield get(this, 'user').save()
      .then(() => {
        set(this, 'lastUsed.theme', get(this, 'user.theme'));
        this._loadTheme();
        this._loadLanguage();
        get(this, 'notify').success('Your profile was updated.');
      })
      .catch(err => {
        get(this, 'notify').error(errorMessages(err));
        get(this, 'user').rollbackAttributes();
        set(this, 'name', get(this, 'user.name'));
        set(this, 'slug', get(this, 'user.slug'));
      });
  }).drop(),

  init() {
    this._super(...arguments);
    // copy so we aren't manipulating the user's name directly
    set(this, 'name', get(this, 'user.name'));
    set(this, 'slug', get(this, 'user.slug'));

    // find our object associated with our user properties
    const language = get(this, 'languages')
      .find(item => get(item, 'id') === get(this, 'user.language'));
    set(this, 'selectedLanguage', language);
    const country = get(this, 'countries')
      .find(item => get(item, 'id') === get(this, 'user.country'));
    set(this, 'selectedCountry', country);
    const title = get(this, 'titles')
      .find(item => get(item, 'id') === get(this, 'user.titleLanguagePreference'));
    set(this, 'selectedTitle', title);
    const theme = get(this, 'themes')
      .find(item => get(item, 'id') === get(this, 'user.theme'));
    set(this, 'selectedTheme', theme);
    const rating = get(this, 'ratings')
      .find(item => get(item, 'id') === get(this, 'user.ratingSystem'));
    set(this, 'selectedRating', rating);
    const filter = get(this, 'filters')
      .find(item => get(item, 'value') === get(this, 'user.sfwFilterPreference'));
    set(this, 'selectedFilter', filter);
  },

  actions: {
    changeLanguage(language) {
      set(this, 'selectedLanguage', language);
      set(this, 'user.language', get(language, 'id'));
    },

    changeCountry(country) {
      set(this, 'selectedCountry', country);
      set(this, 'user.country', get(country, 'id'));
    },

    changeTitle(title) {
      set(this, 'selectedTitle', title);
      set(this, 'user.titleLanguagePreference', get(title, 'id'));
    },

    changeTheme(theme) {
      set(this, 'selectedTheme', theme);
      set(this, 'user.theme', get(theme, 'id'));
    },

    changeRating(rating) {
      set(this, 'selectedRating', rating);
      set(this, 'user.ratingSystem', get(rating, 'id'));
    },

    changeFilter(filter) {
      set(this, 'selectedFilter', filter);
      set(this, 'user.sfwFilterPreference', get(filter, 'value'));
    }
  },

  _loadTheme() {
    const element = [].slice.call(document.head.getElementsByTagName('link'), 0).find(link => (
      'theme' in link.dataset
    ));
    if (!element) { return; }

    if (element.dataset.theme !== get(this, 'user.theme')) {
      element.href = window.Kitsu.themes[get(this, 'user.theme')];
      element.dataset.theme = get(this, 'user.theme');
    }
  },

  async _loadLanguage() {
    const userLocale = get(this, 'user.language');

    if (userLocale !== 'en-us' && LANGUAGES.some(({ id }) => userLocale === id)) {
      let translationsPath = `translations/${userLocale}.json`;
      if (config.kitsu.isProduction) {
        const assetMap = await fetch('/assets/assetMap.json');
        const assetMapJSON = await assetMap.json();
        translationsPath = assetMapJSON.assets[translationsPath];
      }
      const translations = await fetch(`/${translationsPath}`);
      get(this, 'intl').addTranslations(userLocale, await translations.json());
      get(this, 'intl').set('locale', [userLocale, 'en-us']);
      get(this, 'moment').setLocale(momentLocale(get(this, 'intl.primaryLocale')));
    }
  }
});
