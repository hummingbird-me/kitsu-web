import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('users/library/library-entries', 'Integration | Component | users/library/library entries', {
  integration: true
});


test('it renders', function(assert) {
  assert.expect(2);
  this.set('entries', [{
    media: { episodeCount: 13, episodeLength: 24, posterImage: 'pi' },
  }]);
  this.set('entries.meta', { count: 2 });

  this.render(hbs`{{users/library/library-entries entries=entries}}`);
  assert.ok(this.$('[data-test-selector="library-entries"]').length);
  const text = this.$('[data-test-selector="library-entries-stats"]').text().trim();
  assert.equal(text, '2 titles');
});

