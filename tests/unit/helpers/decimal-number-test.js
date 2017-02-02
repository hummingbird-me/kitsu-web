import { decimalNumber } from 'client/helpers/decimal-number';
import { module, test } from 'qunit';

module('Unit | Helper | decimal number');

test('it returns a decimal number to a certain precision', function(assert) {
  assert.equal(decimalNumber([2.34, 2]), 2.34);
  assert.equal(decimalNumber([2.34, 1]), 2.3);
});

test('it returns zero if an initial number is not supplied', function(assert) {
  assert.equal(decimalNumber([]), 0.0);
});

