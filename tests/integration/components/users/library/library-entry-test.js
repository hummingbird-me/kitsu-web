import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

moduleForComponent('users/library/library-entry', 'Integration | Component | users/library/library entry', {
  integration: true,
  beforeEach() {
    const service = this.container.lookup('service:intl');
    service.setLocale('en-us');
  }
});

test('it renders', function(assert) {
  assert.expect(2);
  this.set('entry', {
    media: {
      computedTitle: 'Spice and Wolf',
      posterImage: 'pi',
      subtype: 'TV',
      startDate: moment.utc('2008-01-08T00:00:00.000Z'),
      endDate: moment.utc('2008-03-25T00:00:00.000Z')
    }
  });
  this.render(hbs`{{users/library/library-entry entry=entry}}`);
  assert.ok(this.$('[data-test-selector="library-entry"]').length);
  assert.equal(this.$('[data-test-selector="library-entry-title"]').text().trim(), 'Spice and Wolf');
});

