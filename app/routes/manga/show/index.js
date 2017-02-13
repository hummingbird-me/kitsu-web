import MediaShowRoute from 'client/routes/media/show/index';
import get from 'ember-metal/get';
import { capitalize } from 'ember-string';

export default MediaShowRoute.extend({
  /**
   * Add the manga subtype to the header. The purpose of this is to have a different title
   * between an anime and manga that share a name.
   *
   * @returns {String}
   */
  titleToken() {
    // [anime,manga].show
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const parentModel = this.modelFor(parentRoute);
    const title = get(parentModel, 'computedTitle');
    const subtype = get(parentModel, 'subtype');
    return `${title} | ${capitalize(subtype)}`;
  }
});
