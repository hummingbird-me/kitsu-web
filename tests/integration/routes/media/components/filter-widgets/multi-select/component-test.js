import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('multi-select', 'Integration | Component | multi-select', {
  integration: true
});

test('it renders the selection items', function(assert) {
  this.set('selection', ['one', 'two', 'three']);
  this.render(hbs`
    {{#media/components/filter-widgets/multi-select selection=selection as |option|}}
      {{option}}
    {{/media/components/filter-widgets/multi-select}}
  `);

  assert.equal(this.$('li').length, 3);
  assert.equal(this.$('li').eq(0).text().trim(), 'one');
});

test('selection is added to selected on click', function(assert) {
  this.set('selection', ['one', 'two', 'three']);
  this.set('selected', ['two', 'three']);
  this.set('testSelect', (value) => {
    assert.deepEqual(value, ['two', 'three', 'one']);
  });

  this.render(hbs`{{#media/components/filter-widgets/multi-select
    selection=selection
    selected=selected
    onChange=(action testSelect) as |option|
  }}
    {{option}}
  {{/media/components/filter-widgets/multi-select}}`);

  this.$('li').eq(0).click();
});

test('selection is removed to selected on click', function(assert) {
  this.set('selection', ['one', 'two', 'three']);
  this.set('selected', ['one', 'two', 'three']);
  this.set('testSelect', (value) => {
    assert.deepEqual(value, ['one', 'three']);
  });

  this.render(hbs`{{#media/components/filter-widgets/multi-select
    selection=selection
    selected=selected
    onChange=(action testSelect) as |option|
  }}
    {{option}}
  {{/media/components/filter-widgets/multi-select}}`);

  this.$('li').eq(1).click();
});
