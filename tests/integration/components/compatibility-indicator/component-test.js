import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('compatibility-indicator', 'Integration | Component | compatibility indicator', {
  integration: true
});

const dataset1 = [
  { id: 237, rating: 5.0 },
  { id: 456, rating: 3.5 },
  { id: 329, rating: 1.0 },
  { id: 123, rating: 4.0 },
  { id: 384, rating: 4.0 },
  { id: 982, rating: 2.5 },
  { id: 234, rating: 4.5 },
  { id: 598, rating: 3.0 }
];

const dataset2 = [
  { id: 237, rating: 2.0 },
  { id: 345, rating: 3.5 },
  { id: 329, rating: 1.0 },
  { id: 123, rating: 4.0 },
  { id: 765, rating: 4.0 },
  { id: 982, rating: 2.5 },
  { id: 454, rating: 4.5 },
  { id: 598, rating: 3.0 }
];

test('it does not render wrong arguments', function(assert) {
  this.set('title', 'Test');
  this.set('source', 'some_string');
  this.set('target', [1, 2]);
  this.render(hbs`{{compatibility-indicator
    title=title
    source=source
    target=target
  }}`);

  const $el = this.$('[class="similarity-result"]');
  assert.equal($el.eq(0).text().trim(), 'Test similarity is ?%');
});

test('it does calculate perfect match for identical datasets', function(assert) {
  this.set('title', 'Test');
  this.set('source', dataset1);
  this.set('target', dataset1);
  this.render(hbs`{{compatibility-indicator
    title=title
    source=source
    target=target
  }}`);

  const $el = this.$('[class="similarity-result"]');
  assert.equal($el.eq(0).text().trim(), 'Test similarity is 100%');
});

test('it does calculate proper similarity', function(assert) {
  this.set('title', 'Test');
  this.set('source', dataset1);
  this.set('target', dataset2);
  this.render(hbs`{{compatibility-indicator
    title=title
    source=source
    target=target
  }}`);

  const $el = this.$('[class="similarity-result"]');
  assert.equal($el.eq(0).text().trim(), 'Test similarity is 81.3%');
});
