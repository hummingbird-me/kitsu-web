import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import jQuery from 'jquery';

export default Route.extend({
  ajax: service(),

  model() {
    if (!get(this, 'session.hasUser')) {
      return {};
    }
    return get(this, 'ajax').request('/sso/canny');
  },

  afterModel(_model, transition) {
    if (get(transition, 'targetName') === 'feedback.index') {
      return this.transitionTo('feedback.bugs');
    }
  },

  activate() {
    jQuery('body').toggleClass('canny-body');
  },

  deactivate() {
    jQuery('body').toggleClass('canny-body');
  }
});
