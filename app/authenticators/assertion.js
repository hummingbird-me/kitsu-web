import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import Ember from 'ember';

const {
  RSVP,
  isEmpty,
  run,
  computed,
  makeArray,
  assign: emberAssign,
  merge,
  A,
  $: jQuery,
  testing,
  warn,
  keys: emberKeys
} = Ember;

export default OAuth2PasswordGrant.extend({
  refreshAccessTokens: true,
  serverTokenEndpoint: '/api/oauth/token',
  serverTokenRevocationEndpoint: '/api/oauth/revoke',

  authenticate: function (accessToken, scope = [], headers = {}) {
    return new RSVP.Promise((resolve, reject) => {
      const data                = {
        'grant_type': 'assertion',
        'provider': 'facebook',
        assertion: accessToken
       };
      const serverTokenEndpoint = this.get('serverTokenEndpoint');
      const useXhr = this.get('rejectWithXhr');
      const scopesString = makeArray(scope).join(' ');
      if (!isEmpty(scopesString)) {
        data.scope = scopesString;
      }
      this.makeRequest(serverTokenEndpoint, data, headers).then((response) => {
        run(() => {
          if (!this._validate(response)) {
            reject('access_token is missing in server response');
          }

          const expiresAt = this._absolutizeExpirationTime(response['expires_in']);
          this._scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);
          if (!isEmpty(expiresAt)) {
            response = assign(response, { 'expires_at': expiresAt });
          }

          resolve(response);
        });
      }, (xhr) => {
        run(null, reject, useXhr ? xhr : (xhr.responseJSON || xhr.responseText));
      });
    });
  },
});
