import { moduleFor, test } from 'ember-qunit';
import get from 'ember-metal/get';

moduleFor('service:ajax', 'Unit | Service | ajax');

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
  assert.deepEqual(result, { 'Test-Header': 'Test' });
});
