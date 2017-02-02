import { userBadge } from 'client/helpers/user-badge';
import { module, test } from 'qunit';

module('Unit | Helper | user badge');

test('it returns title if it exists on the user', function(assert) {
  const user = { title: 'staff', isPro: false };
  const result = userBadge([user]);
  assert.equal(result.string, '<span class="tag tag-default role-tag">STAFF</span>');
});

test('it returns "PRO" if title does not exist and user is a pro', function(assert) {
  const user = { isPro: true };
  const result = userBadge([user]);
  assert.equal(result.string, '<span class="tag tag-default role-tag">PRO</span>');
});

test('it returns nothing if the user has no title or pro status', function(assert) {
  const user = { isPro: false };
  const result = userBadge([user]);
  assert.equal(result, undefined);
});
