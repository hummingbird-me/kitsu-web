import MediaShowRoute from 'client/routes/media/show';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import { capitalize } from 'ember-string';

export default MediaShowRoute.extend({
  afterModel(model) {
    const headTags = this._headTags(model);
    headTags.push({
      type: 'meta',
      tagId: 'meta-og-type',
      attrs: {
        property: 'og:type',
        content: 'books.book'
      }
    });
    set(this, 'headTags', headTags);
  },

  titleToken(model) {
    const title = get(model, 'computedTitle');
    const subtype = capitalize(get(model, 'subtype'));
    return `${title} | ${subtype}`;
  }
});
