import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { typeOf } from '@ember/utils';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  page: 0,
  router: service('-routing'),

  didReceiveAttrs() {
    this._super(...arguments);
    const items = get(this, 'items');
    const pages = get(items, 'nbPages');
    const hasNextPage = (pages > 1) && (get(this, 'page') !== (pages - 1));
    set(this, 'hasNextPage', hasNextPage);
  },

  actions: {
    onPagination() {
      const page = get(this, 'page') + 1;
      invokeAction(this, 'onPagination', page).then(() => {
        set(this, 'page', page);
        const hasNextPage = page !== (get(this, 'items.nbPages') - 1);
        set(this, 'hasNextPage', hasNextPage);
      });
    },

    transitionTo(item) {
      invokeAction(this, 'close');
      if (typeOf(item) === 'string') {
        get(this, 'router.router').transitionTo(item);
      } else {
        const type = get(item, 'kind');
        if (type === 'user') {
          get(this, 'router').transitionTo('users.index', [get(item, 'slug')]);
        } else if (type === 'group') {
          get(this, 'router').transitionTo('groups.group.group-page.index', [get(item, 'slug')]);
        } else {
          get(this, 'router').transitionTo(`${type}.show`, [get(item, 'slug')]);
        }
      }
    }
  }
});
