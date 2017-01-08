import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { assert } from 'ember-metal/utils';
import { scheduleOnce } from 'ember-runloop';
import Config from 'client/config/environment';

export default Component.extend({
  classNames: ['kitsu-ad'],

  init() {
    this._super(...arguments);
    assert('Must pass a `slot` param to an `{{ad-unit}}` component.', get(this, 'slot') !== undefined);
    set(this, 'client', Config.google.ads.client);
    // if adsbygoogle is undefined then the script failed to load or was blocked.
    set(this, 'isEnabled', Config.google.ads.enabled === true && window.adsbygoogle !== undefined);
  },

  didInsertElement() {
    this._super(...arguments);
    scheduleOnce('afterRender', () => {
      (window.adsbygoogle || []).push({});
    });
  }
});
