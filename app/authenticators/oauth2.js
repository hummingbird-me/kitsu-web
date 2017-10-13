import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'client/config/environment';

export default OAuth2PasswordGrant.extend({
  refreshAccessTokens: true,
  session: service(),

  init() {
    this._super(...arguments);
    const host = config.kitsu.APIHost || '';
    set(this, 'serverTokenEndpoint', `${host}/api/oauth/token`);
    set(this, 'serverTokenRevocationEndpoint', `${host}/api/oauth/revoke`);
  },

  makeRequest(url, data, headers = {}) {
    get(this, 'session').authorize('authorizer:application', (name, value) => {
      headers[name] = value; // eslint-disable-line
    });
    return this._super(url, data, headers);
  }
});
