import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';
import { isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  shouldRender: true,
  ajax: service(),
  queryCache: service(),

  getCharacters: task(function* (mediaType, mediaId) {
    let language;
    if (mediaType === 'anime') {
      const languages = yield get(this, 'ajax').request(`/anime/${mediaId}/_languages`);
      if (isPresent(languages)) {
        language = languages.find(item => item === 'Japanese') || get(languages, 'firstObject');
      }
    }
    const response = yield get(this, 'queryCache').query('casting', {
      filter: { media_id: mediaId,
        media_type: capitalize(mediaType),
        is_character: true,
        language },
      include: 'character',
      sort: '-featured',
      page: { limit: 4 }
    });
    if (get(response, 'length') === 0) {
      set(this, 'shouldRender', false);
    }
    return response;
  }).restartable(),

  didReceiveAttrs() {
    const type = get(this, 'media.modelType');
    const id = get(this, 'media.id');
    const taskInstance = get(this, 'getCharacters').perform(type, id);
    set(this, 'taskInstance', taskInstance);
  },
});
