import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('lazy-image', 'Integration | Component | lazy image', {
  integration: true
});

test('it inserts the url as the src', function(assert) {
  this.render(hbs`{{lazy-image url="/apple-touch-icon.png"}}`);
  assert.equal(this.$('img').attr('src'), '/apple-touch-icon.png');
});

test('it inserts the default placeholder then the url fails to load', function(assert) {
  this.render(hbs`{{lazy-image url="/apple-touch-icon_NOPE.png"}}`);
  return wait().then(() => {
    assert.equal(this.$('img').attr('src'), '/images/default_poster.jpg');
  });
});

test('it inserts the placeholder as the src when url is a default image', function(assert) {
  this.render(hbs`{{lazy-image url="/images/default_poster.png" placeholder="/images/placeholder.png"}}`);
  assert.equal(this.$('img').attr('src'), '/images/placeholder.png');
});
