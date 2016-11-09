import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import libraryStatus from 'client/utils/library-status';

moduleForComponent('library-dropdown', 'Integration | Component | library-dropdown', {
  integration: true
});

test('it lists the correct statuses', function(assert) {
  this.set('entry', { status: 'planned' });
  this.render(hbs`{{library-dropdown entry=entry type="anime"}}`);

  const statuses = libraryStatus.getEnumKeys();
  let $el = this.$('[data-test-selector="library-dropdown-item"]');
  assert.equal($el.length, statuses.length);
  assert.equal($el.eq(0).text().trim(), 'Currently Watching');

  // At this point, the current status should be removed and the REMOVE_KEY added
  this.set('entry', { status: 'current' });
  $el = this.$('[data-test-selector="library-dropdown-item"]');
  assert.equal($el.length, statuses.length);
  assert.equal($el.eq(0).text().trim(), 'Plan To Watch');
  assert.equal($el.last().text().trim(), 'Remove from Library');
});

test('actions are invoked based on entry status', function(assert) {
  this.set('entry', { status: 'planned', media: { constructor: { modelName: 'anime' } } });
  this.set('create', status => assert.equal(status, 'current'));
  this.set('update', status => assert.equal(status, 'current'));
  this.set('delete', () => assert.ok(true));

  this.render(hbs`{{library-dropdown
    entry=entry
    type="anime"
    methods=(hash
      create=create
      update=update
      delete=delete
    )
  }}`);

  // test update from planned -> current
  let $el = this.$('[data-test-selector="library-dropdown-item"]');
  $el.eq(0).click();

  // test creation
  this.set('entry', undefined);
  $el = this.$('[data-test-selector="library-dropdown-item"]');
  $el.eq(0).click();

  // test deletion
  this.set('entry', { status: 'planned' });
  $el = this.$('[data-test-selector="library-dropdown-item"]');
  $el.last().click();
});
