import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { strictInvokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';
import InfinitePagination from 'client/mixins/infinite-pagination';

export default Component.extend(InfinitePagination, {
  limit: 20,
  router: service('-routing'),
  model: concat('likes', 'paginatedElements'),

  isDisabled: computed('isLoading', function() {
    return get(this, 'isLoading') || !get(this, 'hasNextPage');
  }).readOnly(),

  didReceiveAttrs() {
    this._super(...arguments);
    const likesCount = get(this, 'likes.length');
    if (likesCount === 0) {
      strictInvokeAction(this, 'getLikes').then((records) => {
        this.updatePageState(records);
      });
    } else if (likesCount <= 20) {
      this.updatePageState(get(this, 'likes'));
      set(this, 'isLoading', true);
      const limit = get(this, 'limit');
      const options = { page: { limit, offset: likesCount } };
      this._doPaginationRequest(null, options).finally(() => {
        set(this, 'isLoading', false);
      });
    }
  },

  onPagination() {
    this._super(...arguments);
    set(this, 'isLoading', false);
    strictInvokeAction(this, 'updateLikes', get(this, 'model'));
  },

  actions: {
    onPagination() {
      set(this, 'isLoading', true);
      this._super(...arguments);
    },

    transitionToUser(user) {
      this.$('.modal').on('hidden.bs.modal', () => {
        get(this, 'router').transitionTo('users.index', [user]);
      }).modal('hide');
    }
  }
});
