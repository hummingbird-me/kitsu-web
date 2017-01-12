import Ember from 'ember';
import { createArrayWithLinks } from 'client/utils/array-utils';
import { module, test } from 'qunit';

module('Unit | Utility | array utils');

test('createArrayWithLinks returns an object as an iterable array with links', function(assert) {
  const data = Ember.Object.extend(Ember.Enumerable).create({ links: { next: 'test' } });
  const result = createArrayWithLinks(data);
  assert.deepEqual(result, []);
  assert.deepEqual(result.get('links'), { next: 'test' });
});
