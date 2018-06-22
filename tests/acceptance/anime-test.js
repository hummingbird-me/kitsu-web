import { module, test } from 'qunit';
import { visit, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Anime', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can browse anime', async function(assert) {
    assert.expect(3);
    server.createList('anime', 2);
    server.createList('category', 4);
    server.createList('streamer', 3);

    await visit('/anime');
    const media = find('[data-test-media-poster]');
    const categories = find('[data-test-filter-category]');
    const streamers = find('[data-test-filter-streamer]');

    assert.ok(media);
    assert.ok(categories);
    assert.ok(streamers);
  });

  test('can look at a single anime', async function(assert) {
    assert.expect(1);
    await server.create('anime', { canonicalTitle: 'Trigun', slug: 'trigun' });
    await visit('/anime/trigun');
    const title = find('[data-test-title]');
    assert.equal(title.textContent, 'Trigun');
  });
});
