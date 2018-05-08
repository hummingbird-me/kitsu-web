import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapaterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { get } from '@ember/object';
import config from 'client/config/environment';
import getter from 'client/utils/getter';

export default JSONAPIAdapter.extend(DataAdapaterMixin, {
  host: getter(() => config.kitsu.APIHost),
  namespace: 'api/edge',
  coalesceFindRequests: true,

  authorize(xhr) {
    // Session is injected via `DataAdapaterMixin`
    const { access_token: accessToken } = get(this, 'session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
  },
});
