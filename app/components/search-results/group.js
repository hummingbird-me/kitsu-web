import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { typeOf } from 'ember-utils';
import { invokeAction } from 'ember-invoke-action';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
  router: service('-routing'),

  didReceiveAttrs() {
    this._super(...arguments);
    this.updatePageState(get(this, 'items'));
  },

  onPagination(records) {
    invokeAction(this, 'update', records);
    set(this, 'isLoadingMore', false);
  },

  actions: {
    onPagination() {
      set(this, 'isLoadingMore', true);
      this._super();
    },

    transitionTo(item) {
      invokeAction(this, 'close');
      if (typeOf(item) === 'string') {
        get(this, 'router.router').transitionTo(item);
      } else {
        const type = get(item, 'modelType');
        if (type === 'user') {
          get(this, 'router').transitionTo('users.index', [get(item, 'name')]);
        } else if (type === 'group') {
          get(this, 'router').transitionTo('groups.group.group-page.index', [get(item, 'slug')]);
        } else {
          get(this, 'router').transitionTo(`${type}.show`, [get(item, 'slug')]);
        }
      }
    }
  }
});
