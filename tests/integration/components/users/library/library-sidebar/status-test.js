import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('users/library/library-sidebar/status', 'Integration | Component | users/library/library-sidebar/status', {
  integration: true
});

test('renders the current status', function(assert) {
  assert.expect(2);
  this.set('status', 'current');
  this.render(hbs`{{users/library/library-sidebar/status
    media="anime"
    status=status
  }}`);

  const $el = this.$('li');
  assert.equal($el.length, 1);
  assert.ok($el.text().trim().includes('Currently Watching'));
});

test('triggers the action with the status key', function(assert) {
  assert.expect(1);
  this.set('status', 'current');
  this.set('action', status => assert.equal(status, 'current'));
  this.set('isActive', false);

  this.render(hbs`{{users/library/library-sidebar/status
    status=status
    isActive=isActive
    onClick=action
  }}`);

  const $el = this.$('li');
  $el.click();
  this.set('isActive', true);
  $el.click();
});
