import Route from 'ember-route';
import get from 'ember-metal/get';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  model() {
    return get(this, 'store').findAll('report');
  }
});
