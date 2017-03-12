import Route from 'ember-route';
import get from 'ember-metal/get';
import DataError from 'client/mixins/routes/data-error';

export default Route.extend(DataError, {
  model({ id }) {
    return get(this, 'store').findRecord('group-invite', id, { include: 'group,sender' });
  }
});
