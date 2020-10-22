/* eslint no-undef: "off" */
import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    nolt('init', {
      selector: '.nolt-button',
      url: 'https://kitsu.nolt.io/',
    });
  },
});
