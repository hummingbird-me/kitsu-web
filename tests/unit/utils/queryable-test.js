import { module, test } from 'qunit';
import { serializeArray, deserializeArray } from 'client/utils/queryable';

module('Unit | Utils | queryable', function() {
  test('serializeArray', function(assert) {
    assert.equal(serializeArray([1, 10]), '1..10');
    assert.equal(serializeArray([null, 10]), '..10');
    assert.equal(serializeArray([1, null]), '1..');
    assert.equal(serializeArray(['a', 'b', 'c', '']), 'a,b,c');
  });

  test('deserializeArray', function(assert) {
    assert.deepEqual(deserializeArray('1..10'), [1, 10]);
    assert.deepEqual(deserializeArray('..10'), ['', 10]);
    assert.deepEqual(deserializeArray('1..'), [1, '']);
    assert.deepEqual(deserializeArray('a,b,c'), ['a', 'b', 'c']);
  });
});
