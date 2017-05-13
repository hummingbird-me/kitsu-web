import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'ember-test-selectors';

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
      modelType: 'anime',
      computedTitle: 'Spice and Wolf',
      posterImage: 'pi',
      subtype: 'TV',
      airingStatus: 'finished'
    }
  });
  this.render(hbs`{{users/library/library-entry entry=entry}}`);
  assert.ok(this.$(testSelector('library-entry')).length);
  assert.equal(this.$(testSelector('library-entry-title')).text().trim(), 'Spice and Wolf');
});

