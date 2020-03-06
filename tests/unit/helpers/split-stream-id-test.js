import { splitStreamId } from 'client/helpers/split-stream-id';
import { module, test } from 'qunit';

module('Unit | Helper | split stream id', function() {
  test('it returns the id', function(assert) {
    const result = splitStreamId(['User:42']);
    assert.equal(result, '42');
  });

  test('it returns null if param is empty', function(assert) {
    const result = splitStreamId([null]);
    assert.equal(result, null);
  });
});
