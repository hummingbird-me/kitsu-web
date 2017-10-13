import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  categoryRoute: 'groups.index',
  sortOptions: [{
    key: 'featured',
    value: 'group-list.sort.featured'
  }, {
    key: 'recent',
    value: 'group-list.sort.recent'
  }, {
    key: 'newest',
    value: 'group-list.sort.newest'
  }, {
    key: 'oldest',
    value: 'group-list.sort.oldest'
  }],

  activeSort: computed('sort', function() {
    return get(this, 'sortOptions').find(option => get(option, 'key') === get(this, 'sort'));
  }).readOnly(),

  actions: {
    updateQueryParam(property, value) {
      invokeAction(this, 'updateQueryParam', property, value);
    },

    onPagination() {
      return invokeAction(this, 'onPagination');
    }
  }
});
