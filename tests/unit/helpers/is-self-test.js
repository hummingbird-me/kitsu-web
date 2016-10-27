import { isSelf } from 'client/helpers/is-self';
import { module, test } from 'qunit';

module('Unit | Helper | is self');

test('it works', function(assert) {
  assert.ok(isSelf(1, 1));
  assert.notOk(isSelf(1, 2));
});
