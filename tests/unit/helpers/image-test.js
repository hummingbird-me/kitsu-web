import { image } from 'client/helpers/image';
import { module, test } from 'qunit';

module('Unit | Helper | image', function() {
  test('it returns value when not an object', function(assert) {
    const result = image('/images/hello.png');
    assert.equal(result, '/images/hello.png');
  });

  test('it returns the original key value when not specified', function(assert) {
    const result = image({
      original: '/images/original.png',
      small: '/images/small.png'
    });
    assert.equal(result, '/images/original.png');
  });

  test('it returns the style specified', function(assert) {
    const result = image({
      original: '/images/original.png',
      small: '/images/small.png'
    }, 'small');
    assert.equal(result, '/images/small.png');
  });
});
