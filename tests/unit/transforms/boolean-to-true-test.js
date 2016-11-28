import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:boolean-to-true', 'Unit | Transform | boolean to true');

test('it works', function(assert) {
  const transform = this.subject();
  assert.ok(transform.serialize(true));
  assert.ok(transform.serialize(null));
  assert.notOk(transform.serialize(false));
});
