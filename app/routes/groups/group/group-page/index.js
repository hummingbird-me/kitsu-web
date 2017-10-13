import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  model() {
    return this.modelFor('groups.group.group-page');
  },

  titleToken(model) {
    return get(model, 'group.name');
  }
});
