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

test('#identify calls setUser with right data', function(assert) {
  const adapter = this.subject({ config: this.config });
  this.sandbox.stub(window, 'StreamAnalytics', () => function() { });
  const stub = this.sandbox.stub(adapter.get('client'), 'setUser', () => true);
  adapter.identify({
    distinctId: 1234,
    alias: 'Bob'
  });
  assert.ok(stub.calledWith({ id: 1234, alias: 'Bob' }));
});

test('#trackImpression calls trackImpression with right data', function(assert) {
  const adapter = this.subject({ config: this.config, userSet: true, router: { currentRouteName: 'hello' } });
  this.sandbox.stub(window, 'StreamAnalytics', () => function() { });
  const stub = this.sandbox.stub(adapter.get('client'), 'trackImpression', () => true);
  adapter.trackImpression({
    content_list: ['feed:1234', 'feed:5678']
  });
  assert.ok(stub.calledWith({ content_list: ['feed:1234', 'feed:5678'], location: 'hello' }));
});

test('#trackEngagement calls trackEngagement with right data', function(assert) {
  const adapter = this.subject({ config: this.config, userSet: true, router: { currentRouteName: 'hello' } });
  this.sandbox.stub(window, 'StreamAnalytics', () => function() { });
  const stub = this.sandbox.stub(adapter.get('client'), 'trackEngagement', () => true);
  adapter.trackEngagement({
    label: 'like',
    content: 'post:1234'
  });
  assert.ok(stub.calledWith({ label: 'like', content: 'post:1234', location: 'hello' }));
});
