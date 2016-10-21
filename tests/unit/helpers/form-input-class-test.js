import { formInputClass } from 'client/helpers/form-input-class';
import { module, test } from 'qunit';

module('Unit | Helper | form input class');

test('it works', function(assert) {
  let result = formInputClass([false, false]);
  assert.equal(result, 'form-control');

  result = formInputClass([true, false]);
  assert.equal(result, 'form-control form-control-warning');

  result = formInputClass([false, true]);
  assert.equal(result, 'form-control form-control-success');

  result = formInputClass([true, false]);
  assert.equal(result, 'form-control form-control-warning');
});
