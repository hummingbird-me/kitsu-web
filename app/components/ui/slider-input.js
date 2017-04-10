import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';
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
      doubleSided: true,
      decimal: 0
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
    const [min, max] = get(options, 'range');
    const decimal = get(options, 'decimal');
    noUiSlider.create(elem, {
      start: get(options, 'initial'),
      connect: get(options, 'doubleSided') || get(options, 'connect'),
      step: get(options, 'step'),
      range: { min, max },
      tooltips: get(options, 'showTooltips'),
      format: {
        to(value) {
          return parseFloat(parseFloat(value).toFixed(decimal));
        },

        from(value) {
          return value;
        }
      }
    });
    elem.noUiSlider.on('slide', values => invokeAction(this, 'onSlide', values));
    elem.noUiSlider.on('set', values => invokeAction(this, 'onSet', values));
  }
});
