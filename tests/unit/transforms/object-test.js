import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Transform | object', function(hooks) {
  setupTest(hooks);

  test('#serialize', function(assert) {
    const transform = this.owner.lookup('transform:object');
    assert.deepEqual(transform.serialize(null), {});
    assert.deepEqual(transform.serialize(undefined), {});
    assert.deepEqual(transform.serialize({ foo: 'bar' }), { foo: 'bar' });
  });

  test('#deserialize', function(assert) {
    const transform = this.owner.lookup('transform:object');
    assert.deepEqual(transform.deserialize(null), {});
    assert.deepEqual(transform.deserialize(undefined), {});
    assert.deepEqual(transform.deserialize({ foo: 'bar' }), { foo: 'bar' });
    assert.equal(transform.deserialize(null, { defaultValue: 'hello' }), 'hello');
  });
});
