import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  breadcrumb: null,
  title: 'Kitsu - More of what you love.',

  redirect() {
    if (!get(this, 'session.hasUser')) {
      this.transitionTo('explore.index', 'anime');
    }
  }
});
