import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),

  deleteAccount: task(function* () {
    yield get(this, 'ajax').del(`/users/${get(this, 'session.account.id')}`);
    get(this, 'session').invalidate();
  }).drop()
});
