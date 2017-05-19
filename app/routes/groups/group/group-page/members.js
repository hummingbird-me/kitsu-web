import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    const model = this.modelFor('groups.group.group-page');
    return {
      taskInstance: this.queryPaginated('group-member', this._getRequestOptions(model)),
      paginatedRecords: []
    };
  },

  afterModel(model) {
    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
  },

  titleToken() {
    const model = this.modelFor('groups.group.group-page');
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.group-page.members', { group });
  },

  setHeadTags(model) {
    const description = `Group members of ${get(model, 'group.name')}.
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

  _getRequestOptions(model) {
    return {
      include: 'user',
      filter: { query_group: get(model, 'group.id') },
      fields: { users: ['avatar', 'coverImage', 'name'].join(',') },
      page: { limit: 20 }
    };
  }
});
