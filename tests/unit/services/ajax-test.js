import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { get } from '@ember/object';

module('Unit | Service | ajax', function(hooks) {
  setupTest(hooks);

  test('authentication headers are added to ajax requests', function(assert) {
    assert.expect(1);
    const service = this.owner.factoryFor('service:ajax').create({
      session: {
        isAuthenticated: true,
        data: { authenticated: { access_token: 'abcdef' } }
      }
    });
    const result = get(service, 'headers');
    assert.deepEqual(result, {
      accept: 'application/vnd.api+json',
      Authorization: 'Bearer abcdef'
    });
  });
});
