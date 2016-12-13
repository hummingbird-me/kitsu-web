import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  session: service(),

  model() {
    return get(this, 'store').findAll('block', { include: 'blocked' });
  }
});
