import Base from 'client/authenticators/oauth2';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import RSVP from 'rsvp';

export default Base.extend({
  torii: service(),

  authenticate(provider, options = {}) {
    return new RSVP.Promise((resolve, reject) => {
      get(this, 'torii').open(provider, options).then(providerResponse => {
        const data = { grant_type: 'assertion', assertion: get(providerResponse, 'accessToken'), provider };
        this.makeRequest(get(this, 'serverTokenEndpoint'), data).then(response => {
          run(() => {
            const expiresIn = response.expires_in;
            const expiresAt = this._absolutizeExpirationTime(expiresIn);
            this._scheduleAccessTokenRefresh(expiresIn, expiresAt, response.refresh_token);
            if (!isEmpty(expiresAt)) {
              return resolve(Object.assign(response, { expires_at: expiresAt }));
            }
            resolve(response);
          });
        }, xhr => {
          run(null, reject, xhr.responseJSON || xhr.responseText);
        });
      });
    });
  }
});
