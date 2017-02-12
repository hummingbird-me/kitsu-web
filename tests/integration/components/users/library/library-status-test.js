import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('users/library/library-status', 'Integration | Component | users/library/library status', {
  integration: true,
  beforeEach() {
    const service = this.container.lookup('service:intl');
    service.setLocale('en-us');
  }
});

test('renders the current status', function(assert) {
  assert.expect(2);
  this.set('status', 'current');
  this.render(hbs`{{users/library/library-status
    mediaType="anime"
    status=status
  }}`);

  const $el = this.$('button');
  assert.equal($el.length, 1);
  assert.equal($el.text().trim(), 'Currently Watching');
});

test('triggers the action with the status key', function(assert) {
  assert.expect(1);
  this.set('status', 'current');
  this.set('action', status => assert.equal(status, 'current'));
  this.set('isActive', false);

  this.render(hbs`{{users/library/library-status
    status=status
    mediaType="anime"
    isActive=isActive
    onClick=action
  }}`);

  const $el = this.$('button');
  $el.click();
  this.set('isActive', true);
  $el.click();
});
