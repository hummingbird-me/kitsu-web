import MediaShowRoute from 'client/routes/media/show';
import { get, set } from '@ember/object';

export default MediaShowRoute.extend({
  afterModel(model) {
    this._super(...arguments);

    let type = 'video.other';
    if (get(model, 'subtype') === 'TV') {
      type = 'video.tv_show';
    } else if (get(model, 'subtype') === 'movie') {
      type = 'video.movie';
    }
    const tags = this.setHeadTags(model);
    tags.push({
      type: 'meta',
      tagId: 'meta-og-type',
      attrs: {
        property: 'og:type',
        content: type
      }
    });
    set(this, 'headTags', tags);
  },

  _schemaData(model) {
    const data = this._super(...arguments);
    data['@type'] = 'TVSeries';
    if (get(model, 'episodeCount')) {
      data.numberOfEpisodes = get(model, 'episodeCount');
    }
    return data;
  }
});
