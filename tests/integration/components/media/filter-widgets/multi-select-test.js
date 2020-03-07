import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Component | media/filter widgets/multi select', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the selection items', async function(assert) {
    this.set('selection', ['one', 'two', 'three']);
    await render(hbs`
      {{#media/filter-widgets/multi-select selection=selection as |option|}}
        {{option}}
      {{/media/filter-widgets/multi-select}}
    `);

    assert.equal(this.$('li').length, 3);
    assert.equal(this.$('li').eq(0).text().trim(), 'one');
  });

  test('selection is added to selected on click', async function(assert) {
    this.set('selection', ['one', 'two', 'three']);
    this.set('selected', ['two', 'three']);
    this.set('testSelect', value => {
      assert.deepEqual(value, ['two', 'three', 'one']);
    });

    await render(hbs`{{#media/filter-widgets/multi-select
      selection=selection
      selected=selected
      onChange=(action testSelect) as |option|
    }}
      {{option}}
    {{/media/filter-widgets/multi-select}}`);

    this.$('li').eq(0).click();
  });

  test('selection is removed to selected on click', async function(assert) {
    this.set('selection', ['one', 'two', 'three']);
    this.set('selected', ['one', 'two', 'three']);
    this.set('testSelect', value => {
      assert.deepEqual(value, ['one', 'three']);
    });

    await render(hbs`{{#media/filter-widgets/multi-select
      selection=selection
      selected=selected
      onChange=(action testSelect) as |option|
    }}
      {{option}}
    {{/media/filter-widgets/multi-select}}`);

    this.$('li').eq(1).click();
  });
});
