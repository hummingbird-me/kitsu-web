import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { storageFor } from 'ember-local-storage';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import moment from 'moment';

export default Route.extend(ApplicationRouteMixin, {
  ajax: service(),
  headData: service(),
  intl: service(),
  metrics: service(),
  moment: service(),
  lastUsed: storageFor('last-used'),

  // If the user is authenticated on first load, grab the users data
  beforeModel() {
    const session = get(this, 'session');
    if (get(session, 'isAuthenticated')) {
      return this._getCurrentUser();
    }
  },

  headTags() {
    const title = get(this, 'headData.title');
    const desc = 'Share anime and manga experiences, get recommendations and see what friends are watching or reading.';
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
        content: desc
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
        content: `${window.location.protocol}//${window.location.host}/kitsu-256.png`
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: desc
      }
    }];
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

  _getCurrentUser() {
    return get(this, 'session').getCurrentUser().then((user) => {
      // user setup
      this._loadTheme(user);
      get(this, 'moment').changeTimeZone(get(user, 'timeZone') || moment.tz.guess());

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
        username: get(user, 'name')
      });
    }).catch(() => {
      get(this, 'session').invalidate();
    });
  },

  actions: {
    loading(transition) {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'routeIsLoading', true);
      transition.promise.finally(() => set(controller, 'routeIsLoading', false));
    },

    /**
     * Private Ember API.
     *
     * We want to mark notifications read from any route when the query param changes.
     * Unforunately we can't do that from the documented `queryParamsDidChange` method as that
     * fires before `beforeModel` on initial transition and therefore our sessioned user hasn't
     * been resolved.
     */
    finalizeQueryParamChange(params) {
      if (params.notification && get(this, 'session.hasUser')) {
        this._markNotificationRead(params.notification).finally(() => {
          const controller = this.controllerFor(get(this, 'routeName'));
          set(controller, 'notification', null);
        });
      }
      return this._super(...arguments);
    }
  },

  _loadTheme(user) {
    if (get(this, 'lastUsed.theme')) { return; }

    const theme = get(user, 'theme');
    const element = [].slice.call(document.head.getElementsByTagName('link'), 0).find(link => (
      'theme' in link.dataset
    ));
    if (!element) { return; }

    set(this, 'lastUsed.theme', theme);
    if (element.dataset.theme !== theme) {
      window.location.reload();
    }
  },

  _markNotificationRead(notification) {
    // send off read event
    const feedUrl = `/feeds/notifications/${get(this, 'session.account.id')}/_read`;
    return get(this, 'ajax').request(feedUrl, {
      method: 'POST',
      data: JSON.stringify([notification]),
      contentType: 'application/json'
    }).then(() => {
      // reset default value
      const trackedItem = get(this, 'store').peekAll('notification').findBy('streamId', notification);
      if (trackedItem) {
        set(trackedItem, 'isRead', true);
      }
    }).catch((error) => {
      get(this, 'raven').captureException(error);
    });
  }
});
