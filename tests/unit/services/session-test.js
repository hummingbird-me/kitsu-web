import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import { get } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import DS from 'ember-data';
import setupStore from 'client/tests/helpers/setup-store';
import sinon from 'sinon';

module('Unit | Service | session', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.store = setupStore({
      user: Model.extend({
        name: attr('string')
      })
    });
  });

  hooks.afterEach(function() {
    run(this.store, 'destroy');
  });

  test('#isCurrentUser tests if the passed user is the current user', function(assert) {
    const service = this.owner.factoryFor('service:session').create({
      isAuthenticated: true,
      account: { id: 1 }
    });
    let result = service.isCurrentUser({ id: 1 });
    assert.ok(result);
    result = service.isCurrentUser({ id: 2 });
    assert.notOk(result);
  });

  test('#getCurrentUser retrieves the user and sets account', async function(assert) {
    assert.expect(1);
    const user = run(() => this.store.createRecord('user', { name: 'Holo' }));
    sinon.stub(this.store, 'query').returns([user]);
    const service = this.owner.factoryFor('service:session').create({ store: this.store });
    await service.getCurrentUser();
    assert.equal(get(service, 'account.name'), 'Holo');
  });

  test('#getCurrentUser captures 5xx errors and returns nothing', async function(assert) {
    assert.expect(1);
    const error = new DS.ServerError([{ status: '503' }]);
    sinon.stub(this.store, 'query').throws(error);
    const service = this.owner.factoryFor('service:session').create({ store: this.store });
    await service.getCurrentUser();
    assert.notOk();
  });

  test('#getCurrentUser captures 4xx errors and invalidates session', function(assert) {
    assert.expect(1);
    const error = new DS.UnauthorizedError([{ status: '401' }]);
    sinon.stub(this.store, 'query').throws(error);
    const service = this.owner.factoryFor('service:session').create({ store: this.store });
    sinon.stub(service, 'invalidate');
    return service.getCurrentUser().catch(() => assert.ok(service.invalidate.called));
  });

  test('#getCurrentUser detects an empty array and invalidates session', async function(assert) {
    assert.expect(1);
    sinon.stub(this.store, 'query').returns([]);
    const service = this.owner.factoryFor('service:session').create({ store: this.store });
    sinon.stub(service, 'invalidate');
    return service.getCurrentUser().catch(() => assert.ok(service.invalidate.called));
  });
});
