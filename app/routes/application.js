import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { storageFor } from 'ember-local-storage';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import moment from 'moment';

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
      get(this, 'moment').changeTimeZone(get(user, 'timeZone') || moment.tz.guess());

      // notifications
      this._registerNotifications();

      // i18n
      if (get(user, 'language') === 'fr') {
        const translations = await fetch('/translations/fr-FR.json');
        get(this, 'intl').addTranslations('fr-FR', await translations.json());
        // use en-us as fallback as it is already loaded
        get(this, 'intl').set('locale', ['fr-FR', 'en-us']);
      }

      if (get(user, 'language') === 'es') {
        const translations = await fetch('/translations/es-ES.json');
        get(this, 'intl').addTranslations('es-ES', await translations.json());
        // use en-us as fallback as it is already loaded
        get(this, 'intl').set('locale', ['es-ES', 'en-us']);
      }

      if (get(user, 'language') === 'id') {
        const translations = await fetch('/translations/id-ID.json');
        get(this, 'intl').addTranslations('id-ID', await translations.json());
        // use en-us as fallback as it is already loaded
        get(this, 'intl').set('locale', ['id-ID', 'en-us']);
      }

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
  }
});
