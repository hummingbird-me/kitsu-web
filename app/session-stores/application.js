import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default AdaptiveStore.extend({
  localStorageKey: 'ember_simple_auth:session',
  cookieName: 'ember_simple_auth:session'
});
