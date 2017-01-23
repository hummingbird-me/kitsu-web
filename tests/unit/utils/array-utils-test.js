import Ember from 'ember';
import { createArrayWithLinks, unshiftObject, unshiftObjects } from 'client/utils/array-utils';
import { module, test } from 'qunit';

module('Unit | Utility | array utils');

test('createArrayWithLinks returns an object as an iterable array with links', function(assert) {
  const data = Ember.Object.extend(Ember.Enumerable).create({ links: { next: 'test' } });
  const result = createArrayWithLinks(data);
  assert.deepEqual(result, []);
  assert.deepEqual(result.get('links'), { next: 'test' });
});

test('unshiftObject adds an object to the target when no duplicate exists', function(assert) {
  const result = unshiftObject(['World'], 'Hello');
  assert.deepEqual(result, ['Hello', 'World']);
});

test('unshiftObject does not add an object if a duplicate exists', function(assert) {
  const result = unshiftObject(['Hello', 'World'], 'Hello');
  assert.deepEqual(result, ['Hello', 'World']);
});

test('unshiftObjects adds multiple objects to the target', function(assert) {
  const result = unshiftObjects(['!'], ['Hello', 'World']);
  assert.deepEqual(result, ['Hello', 'World', '!']);
});
