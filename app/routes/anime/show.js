import MediaShowRoute from 'client/routes/media/show';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default MediaShowRoute.extend({
  afterModel(model) {
    let type = 'video.other';
    if (get(model, 'mediaType') === 'TV') {
      type = 'video.tv_show';
    } else if (get(model, 'mediaType') === 'movie') {
      type = 'video.movie';
    }
    const headTags = this._headTags(model);
    headTags.push({
      type: 'meta',
      tagId: 'meta-og-type',
      attrs: {
        property: 'og:type',
        content: type
      }
    });
    set(this, 'headTags', headTags);
  }
});
