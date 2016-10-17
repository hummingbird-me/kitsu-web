import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('compatibility-indicator', 'Integration | Component | compatibility indicator', {
  integration: true
});

test('it does not render wrong arguments', function(assert) {
  this.set('title', 'Test');
  this.set('source', 'some_string');
  this.set('target', [1, 2]);
  this.render(hbs`{{compatibility-indicator
    title=title
    source=source
    target=target
  }}`);

  let $el = this.$('[data-test-selector="similarity-result"]');
  assert.equal($el.eq(0).text().trim(), 'Test similarity is 0%');
});
