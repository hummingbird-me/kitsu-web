import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('truncate-text', 'Integration | Component | truncate-text', {
  integration: true
});

test('text is truncated based on max', function(assert) {
  this.set('text', 'Hello, World!');
  this.render(hbs`{{truncate-text text max=5}}`);
  assert.equal(this.$().text().trim().replace(/(\r\n|\n|\r)/gm, ''), 'He...  more');
});

test('text is changed upon expansion', function(assert) {
  this.set('text', 'Hello, World!');
  this.render(hbs`{{truncate-text text max=5}}`);
  this.$('a').click();
  assert.equal(this.$().text().trim().replace(/(\r\n|\n|\r)/gm, ''), 'Hello, World!  less');
});
