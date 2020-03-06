import { unshiftObject, unshiftObjects } from 'client/utils/array-utils';
import { module, test } from 'qunit';

module('Unit | Utility | array utils', function() {
  test('unshiftObject adds an object to the target when no duplicate exists', function(assert) {
    const result = unshiftObject(['World'], 'Hello');
    assert.deepEqual(result, ['Hello', 'World']);
  });

  test('unshiftObject does not add an object if a duplicate exists', function(assert) {
    const result = unshiftObject(['Hello', 'World'], 'Hello');
    assert.deepEqual(result, ['Hello', 'World']);
  });

  test('unshiftObjects adds multiple objects to the target', function(assert) {
    const result = unshiftObjects(['!'], ['Hello', 'World']);
    assert.deepEqual(result, ['Hello', 'World', '!']);
  });
});
