import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui/slider-input', 'Integration | Component | ui/slider-input', {
  integration: true
});


test('decimal setting is respected', function(assert) {
  this.set('initial', [50, 90]);
  this.set('range', [1, 100]);
  this.render(hbs`
    {{ui/slider-input
        options=(hash
          initial=initial range=range
          decimal=2 step=0.01
        )
    }}
  `);

  const elem = this.$('.noUi-target')[0];
  assert.deepEqual(elem.noUiSlider.get(), [50, 90]);
  elem.noUiSlider.set([25.125, null]);
  assert.deepEqual(elem.noUiSlider.get(), [25.13, 90]);
});

test('actions are called', function(assert) {
  this.set('onSlide', () => assert.ok(true));
  this.set('onSet', () => assert.ok(true));
  this.set('initial', [1, 100]);
  this.set('range', [1, 100]);
  this.render(hbs`{{ui/slider-input
    options=(hash initial=initial range=range)
    onSlide=(action onSlide)
    onSet=(action onSet)
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
