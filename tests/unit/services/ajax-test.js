import { moduleFor, test } from 'ember-qunit';
import get from 'ember-metal/get';

moduleFor('service:ajax', 'Unit | Service | ajax', {
  needs: ['service:session']
});

test('authentication headers are added to ajax requests', function(assert) {
  assert.expect(1);
  const service = this.subject({
    session: {
      isAuthenticated: true,
      authorize(_, fn) {
        fn('Test-Header', 'Test');
      }
    }
  });
  const result = get(service, 'headers');
  assert.deepEqual(result, {
    accept: 'application/vnd.api+json',
    'content-type': 'application/vnd.api+json',
    'Test-Header': 'Test'
  });
});
