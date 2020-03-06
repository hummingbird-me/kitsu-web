import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | application', function(hooks) {
  setupTest(hooks);

  test('title works', function(assert) {
    assert.expect(2);
    const route = this.owner.lookup('route:application');
    assert.equal(route.title(['One', 'Two']), 'Two | One | Kitsu');
    assert.equal(route.title(), 'Kitsu');
  });
});
