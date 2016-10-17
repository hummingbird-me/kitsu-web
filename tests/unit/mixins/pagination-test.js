import Ember from 'ember';
import PaginationMixin from 'client/mixins/pagination';
import { module, test } from 'qunit';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

module('Unit | Mixin | pagination');

test('nextLink returns the next link or undefined', function(assert) {
  const PaginationObject = Ember.Object.extend(PaginationMixin, {
    model: { links: { next: 'https://www.google.com' } }
  });
  const subject = PaginationObject.create();

  let result = get(subject, 'nextLink');
  assert.equal(result, 'https://www.google.com');
  set(subject, 'model', { links: {} });
  result = get(subject, 'nextLink');
  assert.equal(result, undefined);
});

test('#_parseLink builds a query param object from a URL', function(assert) {
  const PaginationObject = Ember.Object.extend(PaginationMixin);
  const subject = PaginationObject.create();
  let result = subject._parseLink('https://example.com?param=true');
  assert.deepEqual(result, { param: 'true' });
  result = subject._parseLink('https://example.com?filter[slug]=hello-world&filter[param]=true');
  assert.deepEqual(result, {
    filter: {
      slug: 'hello-world',
      param: 'true'
    }
  });
  result = subject._parseLink('https://example.com');
  assert.deepEqual(result, {});
});
