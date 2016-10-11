import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:object', 'Unit | Transform | object', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('#serialize', function(assert) {
  const transform = this.subject();
  assert.deepEqual(transform.serialize(null), {});
  assert.deepEqual(transform.serialize(undefined), {});
  assert.deepEqual(transform.serialize({ foo: 'bar' }), { foo: 'bar' });
});

test('#deserialize', function(assert) {
  const transform = this.subject();
  assert.deepEqual(transform.deserialize(null), {});
  assert.deepEqual(transform.deserialize(undefined), {});
  assert.deepEqual(transform.deserialize({ foo: 'bar' }), { foo: 'bar' });
  assert.equal(transform.deserialize(null, { defaultValue: 'hello' }), 'hello');
});
