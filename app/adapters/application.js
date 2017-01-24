import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapaterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from 'client/config/environment';

export default JSONAPIAdapter.extend(DataAdapaterMixin, {
  authorizer: 'authorizer:application',
  host: config.APIHost,
  namespace: '/api/edge',
  coalesceFindRequests: true
});
