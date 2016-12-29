import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { alias } from 'ember-computed';
import { strictInvokeAction } from 'ember-invoke-action';
import PaginationMixin from 'client/mixins/pagination';

export default Component.extend(PaginationMixin, {
  limit: 20,

  router: service('-routing'),
  model: alias('likes'),

  didReceiveAttrs() {
    this._super(...arguments);
    const count = get(this, 'likes.length');
    if (count === 0) {
      strictInvokeAction(this, 'getLikes');
    } else if (get(this, 'nextLink') !== undefined && count <= 20) {
      get(this, 'getNextData').perform().then(records => (
        this.send('updateNextPage', records, get(records, 'links'))
      )).catch(() => {});
    }
  },

  actions: {
    updateNextPage(records, links) {
      const dup = get(this, 'likes').toArray();
      dup.addObjects(records);
      set(dup, 'links', links);
      strictInvokeAction(this, 'updateLikes', dup);
    },

    transitionToUser(user) {
      this.$('.modal').on('hidden.bs.modal', () => {
        get(this, 'router').transitionTo('users.index', [user]);
      }).modal('hide');
    }
  }
});
