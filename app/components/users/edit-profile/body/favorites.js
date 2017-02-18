import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  classNames: ['tab-pane'],
  tab: 'anime',

  init() {
    this._super(...arguments);
    const data = get(this, 'externalData');
    if (data) {
      set(this, 'tab', get(data, 'tab') || get(this, 'tab'));
    }
  }
});
