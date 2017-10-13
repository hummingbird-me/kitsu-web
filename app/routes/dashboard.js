import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  breadcrumb: null,
  title: 'Kitsu - More of what you love.',

  redirect() {
    if (!get(this, 'session.hasUser')) {
      this.transitionTo('explore.index', 'anime');
    }
  }
});
