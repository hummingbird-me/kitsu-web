import MediaShowController from 'client/controllers/media/show';
import get from 'ember-metal/get';

export default MediaShowController.extend({
  schemaType: 'TVSeries',
  _schemaData() {
    const data = this._super();
    if (get(this, 'media.episodeCount')) {
      data.push({
        type: 'meta',
        name: 'numberOfEpisodes',
        content: get(this, 'media.episodeCount')
      });
    }
    return data;
  }
});
