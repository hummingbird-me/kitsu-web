import Component from 'ember-one-way-controls/components/one-way-file';
import get from 'ember-metal/get';

export default Component.extend({
  classNames: ['hidden-xs-up'],

  change(event) {
    get(this, 'update')(event.target);
  }
});
