import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { capitalize } from '@ember/string';

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
    } else {
      filter = { manga_id: get(media, 'id'), number };
    }
    const units = yield get(this, 'queryCache').query(unitType, { filter });
    return get(units, 'firstObject');
  }).restartable(),

  model({ number }) {
    return get(this, 'modelTask').perform(number);
  },

  afterModel(model) {
    if (model === undefined) {
      const mediaType = get(this, 'routeName').split('.')[0];
      const unitType = mediaType === 'anime' ? 'episodes' : 'chapters';
      this.transitionTo(`${mediaType}.show.${unitType}.index`);
    }
  },

  setupController(controller) {
    this._super(...arguments);
    const [mediaType] = get(this, 'routeName').split('.');
    const media = this.modelFor(`${mediaType}.show`);
    set(controller, 'media', media);
  }
});
