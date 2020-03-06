import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('stream adapter', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
    this.config = { test: { apiKey: 'xxxx', token: 'xxxx' } };
  });

  hooks.afterEach(function() {
    this.sandbox.restore();
  });

  test('#identify calls setUser with right arguments', function(assert) {
    const adapter = this.owner.factoryFor('metrics-adapter:stream').create({ config: this.config });
    const stub = this.sandbox.stub(adapter.client, 'setUser').callsFake(() => true);
    adapter.identify({
      distinctId: 1234,
      alias: 'Bob'
    });
    assert.ok(stub.calledWith({ id: 1234, alias: 'Bob' }));
  });

  test('#trackImpression calls trackImpression with right data', function(assert) {
    const adapter = this.owner.factoryFor('metrics-adapter:stream').create({
      config: this.config,
      this: { router: { currentRouteName: 'hello' } },
      hasUser: true
    });
    const stub = this.sandbox.stub(adapter.client, 'trackImpression').callsFake(() => true);
    adapter.trackImpression({
      content_list: ['feed:1234', 'feed:5678']
    });
    assert.ok(stub.calledWith({ content_list: ['feed:1234', 'feed:5678'], location: 'hello' }));
  });

  test('#trackEngagement calls trackEngagement with right data', function(assert) {
    const adapter = this.owner.factoryFor('metrics-adapter:stream').create({
      config: this.config,
      this: { router: { currentRouteName: 'hello' } },
      hasUser: true,
    });
    const stub = this.sandbox.stub(adapter.client, 'trackEngagement').callsFake(() => true);
    adapter.trackEngagement({
      label: 'like',
      content: 'post:1234'
    });
    assert.ok(stub.calledWith({ label: 'like', content: 'post:1234', location: 'hello' }));
  });
});
