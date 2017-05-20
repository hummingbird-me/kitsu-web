import computed from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import AjaxService from 'ember-ajax/services/ajax';
import config from 'client/config/environment';
import getter from 'client/utils/getter';

export default AjaxService.extend({
  host: getter(() => config.kitsu.APIHost),
  namespace: '/api/edge',
  session: service(),

  headers: computed('session.isAuthenticated', function() {
    const headers = {
      accept: 'application/vnd.api+json',
      'content-type': 'application/vnd.api+json'
    };
    const isAuthenticated = get(this, 'session.isAuthenticated');
    if (isAuthenticated) {
      get(this, 'session').authorize('authorizer:application', (headerName, headerValue) => {
        headers[headerName] = headerValue;
      });
    }
    return headers;
  }).readOnly()
});
