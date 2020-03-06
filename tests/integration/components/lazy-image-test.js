import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | lazy image', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders correctly', async function(assert) {
    await render(hbs`{{lazy-image src="/example.png"}}`);
    assert.equal(this.$('img').attr('data-src'), '/example.png');
  });
});
