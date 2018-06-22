import { moduleFor, test } from 'ember-qunit';
import { get } from '@ember/object';

moduleFor('service:ajax', 'Unit | Service | ajax', {
  needs: ['service:session']
});

test('authentication headers are added to ajax requests', function(assert) {
  assert.expect(1);
  const service = this.subject({
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
