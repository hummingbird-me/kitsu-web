import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import { modelType } from 'client/helpers/model-type';

export default Component.extend({
  tagName: 'section',
  classNames: ['media--main-characters'],
  store: service(),

  getCharacters: task(function* (mediaType, mediaId) {
    return yield get(this, 'store').query('casting', {
      filter: {
        media_id: mediaId,
        media_type: capitalize(mediaType)
      },
      include: 'character',
      sort: '-featured',
      page: { limit: 4 }
    });
  }).restartable(),

  didReceiveAttrs() {
    const type = modelType([get(this, 'media')]);
    const id = get(this, 'media.id');
    const taskInstance = get(this, 'getCharacters').perform(type, id);
    set(this, 'taskInstance', taskInstance);
  },
});
