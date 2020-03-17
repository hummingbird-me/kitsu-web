import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { storageFor } from 'ember-local-storage';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import moment from 'moment';
import LANGUAGES from 'client/utils/languages';
import { environment, kitsu } from 'client/config/environment';

export default Route.extend(ApplicationRouteMixin, {
  features: service(),
  head: service('head-data'),
  headTagsService: service('head-tags'),
  intl: service(),
  metrics: service(),
  moment: service(),
  raven: service(),
  cache: storageFor('last-used'),
  local: storageFor('local-cache'),

  // If the user is authenticated on first load, grab the users data
  async beforeModel() {
    // Load English translation as default
    const translations = await fetch('/translations/en-us.json');
    get(this, 'intl').addTranslations('en-us', await translations.json());

    // session
    const session = get(this, 'session');
    if (get(session, 'isAuthenticated')) {
      return this._getCurrentUser();
    }
    return get(this, 'features').fetchFlags();
  },

  title(tokens) {
    const base = 'Kitsu';
    // If the route hasn't defined a `titleToken` then try to grab the route
    // name from the `titles` table in translations.
    const hasTokens = tokens && tokens.length > 0;
    if (hasTokens === false) {
      const key = `titles.${get(this, 'router.currentRouteName')}`;
      let title = get(this, 'intl').t(key);
      if (title && title.toString().includes('Missing translation')) {
        title = undefined;
      }
      // eslint-disable-next-line no-param-reassign
      tokens = title ? [title] : undefined;
    }
    return tokens ? `${tokens.reverse().join(' | ')} | ${base}` : base;
  },

  // This method is fired by ESA when authentication is successful
  sessionAuthenticated() {
    this._getCurrentUser();
  },

  sessionInvalidated() {
    get(this, 'metrics').invoke('unidentify', 'GoSquared', {});
    this._super(...arguments);
  },

  headTags() {
    const title = get(this, 'head.title');
    const description = `Share anime and manga experiences, get recommendations and see what
      friends are watching or reading.`;
    return [{
      type: 'title',
      tagId: 'title',
      content: title
    }, {
      type: 'link',
      tagId: 'link-canonical',
      attrs: {
        rel: 'canonical',
        href: window.location.href
      }
    }, {
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: description
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-url',
      attrs: {
        property: 'og:url',
        content: window.location.href
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: title
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-type',
      attrs: {
        property: 'og:type',
        content: 'website'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-image',
      attrs: {
        property: 'og:image',
        content: 'https://kitsu.io/kitsu-256.png'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: description
      }
    }];
  },

  actions: {
    loading(transition) {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'routeIsLoading', true);
      transition.promise.finally(() => {
        scheduleOnce('afterRender', () => {
          window.prerenderReady = true;
        });
        set(controller, 'routeIsLoading', false);
      });
    },

    init() {
      this.on('routeDidChange', () => {
        scheduleOnce('afterRender', () => {
          get(this, 'headTagsService').collectHeadTags();
        });
        return true;
      });
    }
  },

  _getCurrentUser() {
    return get(this, 'session').getCurrentUser().then(async user => {
      // user setup
      this._loadTheme(user);
      this._loadLanguage(user); // i18n
      get(this, 'moment').changeTimeZone(get(user, 'timeZone') || moment.tz.guess());

      // notifications
      this._registerNotifications();

      // metrics
      get(this, 'metrics').identify({
        distinctId: get(user, 'id'),
        alias: get(user, 'name'), // google uses alias > name
        name: get(user, 'name'),
        email: get(user, 'email'),
        created_at: get(user, 'createdAt')
      });
      get(this, 'raven').callRaven('setUserContext', {
        id: get(user, 'id'),
        user: get(user, 'slug')
      });

      return get(this, 'features').fetchFlags();
    }).catch(() => {
      get(this, 'session').invalidate();
    });
  },

  _registerNotifications() {
    if (get(this, 'session.account.feedCompleted')) {
      window.OneSignal.push(() => {
        window.OneSignal.isPushNotificationsEnabled(isEnabled => {
          if (isEnabled) {
            // retry hookup if it failed last time
            const userId = get(this, 'local.oneSignalPlayerId');
            if (userId) {
              this._setupNotifications(userId);
            }
          } else {
            window.OneSignal.showHttpPrompt();
            window.OneSignal.on('subscriptionChange', isSubscribed => {
              if (isSubscribed) {
                window.OneSignal.getUserId().then(userId => {
                  // store the id so we can retry on next refresh if hookup fails
                  set(this, 'local.oneSignalPlayerId', userId);
                  this._setupNotifications(userId);
                });
              }
            });
          }
        });
      });
    }
  },

  _setupNotifications(userId) {
    window.OneSignal.push(() => {
      get(this, 'store').createRecord('one-signal-player', {
        playerId: userId,
        platform: 'web',
        user: get(this, 'session.account')
      }).save().then(() => {
        get(this, 'local').clear();
      });
    });
  },

  _loadTheme(user) {
    if (get(this, 'cache.theme')) { return; }

    const theme = get(user, 'theme');
    const element = [].slice.call(document.head.getElementsByTagName('link'), 0).find(link => (
      'theme' in link.dataset
    ));
    if (!element) { return; }

    set(this, 'cache.theme', theme);
    if (element.dataset.theme !== theme) {
      element.href = window.Kitsu.themes[theme];
      element.dataset.theme = theme;
    }
  },

  async _loadLanguage(user) {
    console.log(environment);
    console.log(kitsu.env);
    const userLocale = get(user, 'language');

    if (userLocale !== 'en-us' && LANGUAGES.some(({ id }) => userLocale === id)) {
      let translationsPath = `translations/${userLocale}.json`;
      if (environment === 'production') {
        const assetMap = await fetch('/assets/assetMap.json');
        const assetMapJSON = await assetMap.json();
        translationsPath = assetMapJSON.assets[translationsPath];
      }
      const translations = await fetch(`/${translationsPath}`);
      get(this, 'intl').addTranslations(userLocale, await translations.json());
      get(this, 'intl').set('locale', [userLocale, 'en-us']);
    }
  }
});
