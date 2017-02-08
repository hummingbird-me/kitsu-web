import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lazy-image', 'Integration | Component | lazy image', {
  integration: true
});

test('it renders correctly', function(assert) {
  this.render(hbs`{{lazy-image src="/example.png"}}`);
  assert.equal(this.$('img').attr('data-src'), '/example.png');
});
