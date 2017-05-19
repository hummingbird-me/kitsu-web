import MediaShowRoute from 'client/routes/media/show';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { capitalize } from 'ember-string';

export default MediaShowRoute.extend({
  afterModel(model) {
    this._super(...arguments);

    const tags = this.setHeadTags(model);
    tags.push({
      type: 'meta',
      tagId: 'meta-og-type',
      attrs: {
        property: 'og:type',
        content: 'books.book'
      }
    });
    set(this, 'headTags', tags);
  },

  titleToken(model) {
    const title = get(model, 'computedTitle');
    const subtype = capitalize(get(model, 'subtype'));
    return `${title} | ${subtype}`;
  }
});
