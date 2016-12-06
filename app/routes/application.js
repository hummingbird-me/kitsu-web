import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  i18n: service(),
  headData: service(),
  metrics: service(),
  session: service(),

  // If the user is authenticated on first load, grab the users data
  beforeModel() {
    const session = get(this, 'session');
    if (get(session, 'isAuthenticated')) {
      return this._getCurrentUser();
    }
    // boot intercom for guests
    get(this, 'metrics').invoke('identify', 'Intercom', {});
  },

  headTags() {
    const desc = 'TODO @Josh: Kitsu Default Description';
    console.log('uhhhh?', get(this, 'headData.title'));
    return [{
      type: 'title',
      tagId: 'title',
      content: get(this, 'headData.title')
    }, {
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: desc
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: get(this, 'headData.title')
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
    }, {
      type: 'meta',
      tagId: 'meta-twitter-image',
      attrs: {
        name: 'twitter:image',
        content: `${window.location.protocol}//${window.location.host}/kitsu-256.png`,
      }
    }];
  },

  title(tokens) {
    const base = 'Kitsu';
    // If the route hasn't defined a `titleToken` then try to grab the route
    // name from the `titles` table in translations.
    const hasTokens = tokens && tokens.length > 0;
    if (hasTokens === false) {
      let title = get(this, 'i18n')
        .t(`titles.${get(this, 'router.currentRouteName')}`) || undefined;
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
    // destroy the intercom cookies before we reload the page
    if (window.Intercom !== undefined) {
      window.Intercom('shutdown');
    }
    this._super(...arguments);
  },

  _getCurrentUser() {
    return get(this, 'session').getCurrentUser()
      .then((user) => {
        get(this, 'metrics').identify({
          distinctId: get(user, 'id'),
          alias: get(user, 'name'), // google uses alias > name
          name: get(user, 'name'),
          email: get(user, 'email'),
          created_at: get(user, 'createdAt')
        });
      })
      .catch(() => get(this, 'session').invalidate());
  },

  actions: {
    loading(transition) {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'routeIsLoading', true);
      transition.promise.finally(() => set(controller, 'routeIsLoading', false));
    },
  }
});
