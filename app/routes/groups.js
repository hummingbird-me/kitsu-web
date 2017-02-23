import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  /**
   * Redirect the user to the group creation page from `/groups`.
   */
  redirect(_, transition) {
    const targetRouteName = get(transition, 'targetName');
    if (targetRouteName === 'groups.index') {
      this.transitionTo('groups.new');
    }
  }
});
