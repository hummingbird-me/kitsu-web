import { toLower } from 'client/helpers/to-lower';
import { module, test } from 'qunit';

module('Unit | Helper | to lower', function() {
  test('it works with an array of strings', function(assert) {
    const arr = ['A', 'B', 'C'];
    const result = toLower([arr]);
    assert.deepEqual(result, ['a', 'b', 'c']);
  });

  test('it works with a single string', function(assert) {
    const result = toLower(['heLLo']);
    assert.equal(result, 'hello');
  });

  test('returns empty string if no arguments', function(assert) {
    const result = toLower([]);
    assert.equal(result, '');
  });
});
