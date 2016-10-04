import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
/* global noUiSlider */

export default Component.extend({
  classNames: ['slider'],

  init() {
    this._super(...arguments);
    set(this, 'defaultOptions', {
      start: 0,
      end: 100,
      step: 1,
      initialStart: 0,
      initialEnd: 100,
      doubleSided: false,
      decimal: 2
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    // merge passed in options and the default options
    const defaultOptions = get(this, 'defaultOptions');
    const options = get(this, 'options');
    set(this, '_options', Object.assign(defaultOptions, options));
  },

  didInsertElement() {
    this._super(...arguments);
    const elem = this.$()[0];
    const options = get(this, '_options');
    const selected = [get(options, 'initialStart')];
    if (get(options, 'doubleSided') === true) {
      selected.push(get(options, 'initialEnd'));
    }

    const decimal = get(options, 'decimal');
    noUiSlider.create(elem, {
      start: selected,
      connect: get(options, 'doubleSided'),
      step: get(options, 'step'),
      range: {
        'min': get(options, 'start'),
        'max': get(options, 'end')
      },
      format: {
        to(value) {
          return parseFloat(parseFloat(value).toFixed(decimal));
        },

        from(value) {
          return value;
        }
      }
    });
    elem.noUiSlider.on('slide', (values) => get(this, 'onUpdate')(values));
    elem.noUiSlider.on('set', () => get(this, 'onRelease')());
  }
});
