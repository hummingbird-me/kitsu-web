import { module, test } from 'qunit';
import libraryStatus from '../../../utils/library-status';

module('Unit | Utility | library status');

test('#getEnumKeys should return all library entry keys', function(assert) {
  assert.expect(1);
  const result = libraryStatus.getEnumKeys();
  assert.deepEqual(result, ['current', 'planned', 'completed', 'on_hold', 'dropped']);
});

test('#numberToEnum should convert to the enum key', function(assert) {
  assert.expect(1);
  const result = libraryStatus.numberToEnum(2);
  assert.equal(result, 'planned');
});

test('#enumToNumber should convert to the status index', function(assert) {
  assert.expect(1);
  const result = libraryStatus.enumToNumber('on_hold');
  assert.equal(result, 4);
});
