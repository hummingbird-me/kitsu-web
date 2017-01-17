import getTitleField from 'client/utils/get-title-field';
import { module, test } from 'qunit';

module('Unit | Utility | get title field');

test('it returns `en` for `english`', function(assert) {
  const result = getTitleField('english');
  assert.equal(result, 'en');
});

test('it returns `en_jp` for `romanized`', function(assert) {
  const result = getTitleField('romanized');
  assert.equal(result, 'en_jp');
});

test('it returns `canonical` as default', function(assert) {
  const result = getTitleField('something_else');
  assert.equal(result, 'canonical');
});
