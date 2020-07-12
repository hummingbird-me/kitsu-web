import { set } from '@ember/object';
import OAuth2CodeProvider from 'torii/providers/oauth2-code';
import randomUrlSafe from 'torii/lib/random-url-safe';

export default OAuth2CodeProvider.extend({
  requiredUrlParams: ['code_challenge', 'code_challenge_method'],
  responseParams: ['state'],
  codeChallengeMethod: 'plain',
  baseUrl: 'https://myanimelist.net/v1/oauth2/authorize',

  open(options) {
    set(this, 'codeChallenge', randomUrlSafe(40));
    return {
      ...this._super(options),
      codeChallenge: this.codeChallenge
    };
  }
});
