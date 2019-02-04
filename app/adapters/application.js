import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapaterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { get } from '@ember/object';
import config from 'client/config/environment';

export default JSONAPIAdapter.extend(DataAdapaterMixin, {
  host: config.kitsu.APIHost,
  namespace: 'api/edge',
  coalesceFindRequests: false,

  authorize(xhr) {
    // Session is injected via `DataAdapaterMixin`
    const { access_token: accessToken } = get(this, 'session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
  },
});
