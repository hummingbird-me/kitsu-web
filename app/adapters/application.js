import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapaterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from 'client/config/environment';
import getter from 'client/utils/getter';

export default JSONAPIAdapter.extend(DataAdapaterMixin, {
  authorizer: 'authorizer:application',
  host: getter(() => config.kitsu.APIHost),
  namespace: 'api/edge',
  coalesceFindRequests: true
});
