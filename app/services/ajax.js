import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';
import config from 'client/config/environment';

export default AjaxService.extend({
  contentType: 'application/vnd.api+json',
  namespace: '/api/edge',
  session: service(),

  init() {
    this._super(...arguments);
    set(this, 'host', config.kitsu.APIHost);
  },

  headers: computed('session.token', function() {
    const headers = {
      accept: 'application/vnd.api+json'
    };
    const token = get(this, 'session.token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }).readOnly()
});
