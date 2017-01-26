import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import getter from 'client/utils/getter';
import config from 'client/config/environment';

export default OAuth2PasswordGrant.extend({
  refreshAccessTokens: true,
  serverTokenEndpoint: getter(() => `${config.APP.APIHost}/api/oauth/token`),
  serverTokenRevocationEndpoint: getter(() => `${config.APP.APIHost}/api/oauth/revoke`)
});
