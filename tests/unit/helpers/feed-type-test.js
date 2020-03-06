import { feedType } from 'client/helpers/feed-type';
import { module, test } from 'qunit';

module('Unit | Helper | feed type', function() {
  test('it returns the activity type dasherized', function(assert) {
    const result = feedType([[{ foreignId: 'LibraryEntry:42' }]]);
    assert.equal(result, 'library-entry');
  });

  test('it returns "post" for comment activities', function(assert) {
    const result = feedType([[{ foreignId: 'Comment:42' }]]);
    assert.equal(result, 'post');
  });
});
