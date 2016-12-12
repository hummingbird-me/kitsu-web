import { truncateText } from 'client/helpers/truncate-text';
import { module, test } from 'qunit';

module('Unit | Helper | truncate text');

test('it returns short strings as they are', function(assert) {
  const result = truncateText(['This is a test string!'], { size: 50 });
  assert.equal(result, 'This is a test string!');
});

test('it returns a shorted string if possible', function(assert) {
  const result = truncateText(['This is a test string!'], { size: 10 });
  assert.equal(result, 'This is a test...');
});

test('it force caps a string outside of the fuzzy range', function(assert) {
  const result = truncateText(['aaaaaaaaaaaaaaaaaaaa'], { size: 10, fuzzyness: 5 });
  assert.equal(result, 'aaaaaaaaaa...');
});
