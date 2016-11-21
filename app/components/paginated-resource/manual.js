import Component from 'ember-component';
import get from 'ember-metal/get';
import PaginationMixin from 'client/mixins/pagination';

export default Component.extend(PaginationMixin, {
  click() {
    get(this, 'getNextData').perform();
    return false;
  }
});
