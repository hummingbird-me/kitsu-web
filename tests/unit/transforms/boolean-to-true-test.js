import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:boolean-to-true', 'Unit | Transform | boolean to true');

test('it works', function(assert) {
  const transform = this.subject();
  assert.ok(transform.deserialize(true));
  assert.ok(transform.deserialize(null));
  assert.ok(transform.deserialize(undefined));
  assert.notOk(transform.deserialize(false));
});
