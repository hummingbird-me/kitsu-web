import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('media/media-poster', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    const service = this.owner.lookup('service:intl');
    service.setLocale('en-US');
    // @Note: This can most likely be removed once ember-href-to solves issue #94
    this.owner.lookup('router:main').setupRouter();
  });

  test('media-poster it renders', async function(assert) {
    assert.expect(1);
    this.set('media', { modelType: 'anime', posterImage: 'pi' });
    await render(hbs`{{media/media-poster media=media}}`);
    const element = this.element.querySelector('[data-test-media-poster]');
    assert.ok(element);
  });
});
