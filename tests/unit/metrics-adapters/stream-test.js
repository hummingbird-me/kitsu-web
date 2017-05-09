import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

moduleFor('metrics-adapter:stream', 'stream adapter', {
  needs: ['service:metrics'],

  beforeEach() {
    this.sandbox = sinon.sandbox.create();
    this.config = { test: { apiKey: 'xxxx', token: 'xxxx' } };
  },

  afterEach() {
    this.sandbox.restore();
  }
});

test('#identify calls setUser with right arguments', function(assert) {
  const adapter = this.subject({ config: this.config });
  const stub = this.sandbox.stub(adapter.client, 'setUser').callsFake(() => true);
  adapter.identify({
    distinctId: 1234,
    alias: 'Bob'
  });
  assert.ok(stub.calledWith({ id: 1234, alias: 'Bob' }));
});

test('#trackImpression calls trackImpression with right data', function(assert) {
  const adapter = this.subject({
    config: this.config,
    hasUser: true,
    router: { currentRouteName: 'hello' }
  });
  const stub = this.sandbox.stub(adapter.client, 'trackImpression').callsFake(() => true);
  adapter.trackImpression({
    content_list: ['feed:1234', 'feed:5678']
  });
  assert.ok(stub.calledWith({ content_list: ['feed:1234', 'feed:5678'], location: 'hello' }));
});

test('#trackEngagement calls trackEngagement with right data', function(assert) {
  const adapter = this.subject({
    config: this.config,
    hasUser: true,
    router: { currentRouteName: 'hello' }
  });
  const stub = this.sandbox.stub(adapter.client, 'trackEngagement').callsFake(() => true);
  adapter.trackEngagement({
    label: 'like',
    content: 'post:1234'
  });
  assert.ok(stub.calledWith({ label: 'like', content: 'post:1234', location: 'hello' }));
});
