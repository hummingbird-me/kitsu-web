import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),

  model() {
    return this.modelFor('groups.group.group-page');
  },

  afterModel(model) {
    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
  },

  titleToken(model) {
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.group-page.rules', { group });
  },

  setHeadTags(model) {
    const description = `Group rules for ${get(model, 'group.name')}.
      ${get(model, 'group.tagline')}`;
    return [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        property: 'description',
        content: description
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: description
      }
    }];
  },
});
