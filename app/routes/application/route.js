import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  i18n: service(),
  intercom: service(),
  metrics: service(),
  session: service(),

  // If the user is authenticated on first load, grab the users data
  beforeModel() {
    const session = get(this, 'session');
    if (get(session, 'isAuthenticated')) {
      return this._getCurrentUser();
    }
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
    get(this, 'intercom').stop();
    this._super(...arguments);
  },

  _getCurrentUser() {
    return get(this, 'session').getCurrentUser()
      .then((user) => {
        get(this, 'metrics').identify({
          distinctId: get(user, 'id'),
          alias: get(user, 'name')
        });
        get(this, 'intercom').set('user.user_id', get(user, 'id'));
        get(this, 'intercom').set('user.name', get(user, 'name'));
        get(this, 'intercom').set('user.email', get(user, 'email'));
        get(this, 'intercom').set('user.created_at', get(user, 'createdAt'));
        get(this, 'intercom').update(get(this, 'intercom.user'));
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
