import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  classNameBindings: ['loadingSizeClass', 'white'],
  classNames: ['loading'],
  tagName: 'span',
  size: 'small',
  white: false,

  init() {
    this.loadingSizeClass = `loading--${get(this, 'size')}`;
    this._super(...arguments);
  }
});
