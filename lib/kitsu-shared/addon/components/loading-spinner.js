import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  classNameBindings: ['loadingSizeClass'],
  classNames: ['loading'],
  tagName: 'span',
  size: 'small',

  init() {
    this.loadingSizeClass = `loading--${get(this, 'size')}`;
    this._super(...arguments);
  }
});
