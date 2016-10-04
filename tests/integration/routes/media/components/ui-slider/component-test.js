import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-slider', 'Integration | Component | ui slider', {
  integration: true
});

test('it renders a single handled slider', function(assert) {
  this.render(hbs`{{media/components/ui-slider}}`);
  const slider = this.$('.noUi-handle');
  assert.equal(slider.length, 1);
});

test('it renders a two handled slider', function(assert) {
  this.render(hbs`{{media/components/ui-slider options=(hash doubleSided=true)}}`);
  const slider = this.$('.noUi-handle');
  assert.equal(slider.length, 2);
});

test('decimal setting is respected', function(assert) {
  // update is called 3 times by both sets, and the mouse click
  // release is called once by the simulated mouse click
  assert.expect(4);
  this.set('update', () => assert.ok(true));
  this.set('release', () => assert.ok(true));
  this.render(hbs`
    {{media/components/ui-slider
        options=(hash
          initialStart=50 initialEnd=90 doubleSided=true
          decimal=2 step=0.01
        )
        onUpdate=(action update)
        onRelease=(action release)
    }}
  `);

  const elem = this.$('.noUi-target')[0];
  assert.deepEqual(elem.noUiSlider.get(), [50, 90]);
  elem.noUiSlider.set([25.125, null]);
  assert.deepEqual(elem.noUiSlider.get(), [25.13, 90]);
});

test('actions are called', function(assert) {
  assert.expect(2);
  this.set('update', () => assert.ok(true));
  this.set('release', () => assert.ok(true));
  this.render(hbs`{{media/components/ui-slider
    onUpdate=(action update)
    onRelease=(action release)
  }}`);


  // trigger an actual click to proc the 'slide' event
  const offset = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + this.$()[0].scrollLeft,
      y: rect.top + this.$()[0].scrollTop
    };
  };
  const elem = this.$('.noUi-target')[0];
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousedown', true, true, window, null, 0, 0,
    offset(elem).left + 100, offset(elem).top + 8,
    false, false, false, false, 0, null);
  elem.querySelectorAll('.noUi-origin')[0].dispatchEvent(event);
});
