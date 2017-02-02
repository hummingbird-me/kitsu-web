import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

moduleFor('metrics-adapter:heap', 'heap adapter', {
  needs: ['service:metrics'],
  beforeEach() {
    this.sandbox = sinon.sandbox.create();
    this.config = { appId: 'xxxx' };
  },
  afterEach() {
    this.sandbox.restore();
  }
});

test('#identify initializes heap correctly', function(assert) {
  const adapter = this.subject({ config: this.config });
  const identifyStub = this.sandbox.stub(window.heap, 'identify', () => true);
  const addUserPropertiesStub = this.sandbox.stub(window.heap, 'addUserProperties', () => true);
  adapter.identify({
    distinctId: 1234,
    alias: 'Bob'
  });
  assert.ok(identifyStub.calledWith(1234), 'heap.identify was called correctly');
  assert.ok(addUserPropertiesStub.calledWith({}), 'heap.addUserProperties was called correctly');
});
