import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

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
    this._super(...arguments);
    jQuery('body').addClass('feedback-page');
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('feedback-page');
  }
});
