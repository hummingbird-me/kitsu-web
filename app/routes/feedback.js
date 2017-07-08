import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

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
    document.body.classList.add('canny-body');
  },

  deactivate() {
    document.body.classList.remove('canny-body');
  }
});
