import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import setupStore from 'client/tests/helpers/setup-store';

module('Unit | Serializer | application', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.store = setupStore({
      user: Model.extend({
        name: attr('string'),
        email: attr('string'),
        password: attr('string'),
        something: attr('string')
      })
    });
  });

  hooks.afterEach(function() {
    run(this.store, 'destroy');
  });

  test('it only serializes changed attributes', function(assert) {
    assert.expect(1);
    let record;
    run(() => {
      record = this.store.createRecord('user', {
        name: 'Holo',
        email: 'spice@wolf.market'
      });
    });
    const serializedRecord = record.serialize();
    const data = {
      data: {
        type: 'users',
        attributes: {
          name: 'Holo',
          email: 'spice@wolf.market'
        }
      }
    };
    assert.deepEqual(serializedRecord, data);
  });

  test('keyForAttribute returns the key as camelCase', function(assert) {
    assert.expect(1);
    const serializer = this.owner.lookup('serializer:application');
    const result = serializer.keyForAttribute('snake_case');
    assert.equal(result, 'snakeCase');
  });

  test('keyForRelationship returns the key as camelCase', function(assert) {
    assert.expect(1);
    const serializer = this.owner.lookup('serializer:application');
    const result = serializer.keyForRelationship('snake_case');
    assert.equal(result, 'snakeCase');
  });
});
