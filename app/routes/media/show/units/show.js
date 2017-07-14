import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { capitalize } from 'ember-string';

export default Route.extend({
  templateName: 'media/show/units/show',
  queryCache: service(),

  modelTask: task(function* (number) {
    const mediaType = capitalize(get(this, 'routeName').split('.')[0]);
    const media = this.modelFor(`${mediaType}.show`);
    const unitType = mediaType === 'Anime' ? 'episode' : 'chapter';
    let filter;
    if (mediaType === 'Anime') {
      filter = {
        mediaType,
        number,
        media_id: get(media, 'id')
      };
    } else filter = { manga_id: get(media, 'id'), number };
    const units = yield get(this, 'queryCache').query(unitType, { filter });
    return get(units, 'firstObject');
  }).restartable(),

  model({ number }) {
    return get(this, 'modelTask').perform(number);
  },

  setupController(controller) {
    this._super(...arguments);
    const [mediaType] = get(this, 'routeName').split('.');
    const media = this.modelFor(`${mediaType}.show`);
    set(controller, 'media', media);
  }
});
