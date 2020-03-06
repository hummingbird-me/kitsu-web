import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Transform | array', function(hooks) {
  setupTest(hooks);

  test('#serialize', function(assert) {
    const transform = this.owner.lookup('transform:array');
    assert.deepEqual(transform.serialize(null), []);
    assert.deepEqual(transform.serialize(undefined), []);
    assert.deepEqual(transform.serialize([1, 2, 3]), [1, 2, 3]);
  });

  test('#deserialize', function(assert) {
    const transform = this.owner.lookup('transform:array');
    assert.deepEqual(transform.deserialize(null), []);
    assert.deepEqual(transform.deserialize(undefined), []);
    assert.deepEqual(transform.deserialize([1, 2, 3]), [1, 2, 3]);
  });
});
