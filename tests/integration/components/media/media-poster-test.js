import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import jQuery from 'jquery';
import run from 'ember-runloop';

moduleForComponent('media/media-poster', 'Integration | Component | media/media poster', {
  integration: true
});

test('media-poster it renders', function(assert) {
  this.set('media', { constructor: { modelName: 'anime' }, youtubeVideoId: 'yt', posterImage: 'pi' });
  this.render(hbs`
    {{media/media-poster media=media}}
    {{from-elsewhere name="modal"}}
  `);
  const $el = this.$('[data-test-selector="media-poster"]');
  assert.equal($el.length, 1);

  // trailer modal can be opened
  assert.equal(jQuery('.modal').length, 0);
  const $trailer = this.$('[data-test-selector="media-poster-trailer"]');
  run(() => {
    $trailer.find('a').click();
    assert.equal(jQuery('.modal').length, 1);
    jQuery('.modal').modal('hide');
  });
});
