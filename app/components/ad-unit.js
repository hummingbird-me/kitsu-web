import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { assert, isPresent } from 'ember-metal/utils';
import { scheduleOnce } from 'ember-runloop';
import Config from 'client/config/environment';

export default Component.extend({
  classNames: ['kitsu-ad'],

  init() {
    this._super(...arguments);
    assert('Must pass a `slot` param to an `{{ad-unit}}` component.', get(this, 'slot') !== undefined);
    set(this, 'client', Config.google.ads.client);
    // if adsbygoogle is undefined then the script failed to load or was blocked.
    let isEnabled = Config.google.ads.enabled === true && window.adsbygoogle !== undefined;
    isEnabled = isPresent(get(this, 'client')) ? isEnabled : false;
    set(this, 'isEnabled', isEnabled);
  },

  didInsertElement() {
    this._super(...arguments);
    scheduleOnce('afterRender', () => {
      (window.adsbygoogle || []).push({});
    });
  }
});
