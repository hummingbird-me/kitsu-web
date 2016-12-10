import Ember from 'ember';
import { prependObjects, createArrayWithLinks } from 'client/utils/array-utils';
import { module, test } from 'qunit';

module('Unit | Utility | array utils');

test('prependObjects prepends objects onto an array', function(assert) {
  const array = Ember.A([2, 3, 4, 5]);
  prependObjects(array, [0, 1]);
  console.log(array);
  assert.deepEqual(array, [0, 1, 2, 3, 4, 5]);
});

test('createArrayWithLinks returns an object as an iterable array with links', function(assert) {
  const data = Ember.Object.extend(Ember.Enumerable).create({ links: { next: 'test' } });
  const result = createArrayWithLinks(data);
  console.log(result);
  assert.deepEqual(result, []);
  assert.deepEqual(result.get('links'), { next: 'test' });
});
