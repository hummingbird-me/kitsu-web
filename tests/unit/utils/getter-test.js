import getter from 'client/utils/getter';
import { module, test } from 'qunit';

module('Unit | Utility | getter');

test('it returns the value on get', function(assert) {
  const result = getter(() => 5);
  assert.equal(5, result.get());
});
