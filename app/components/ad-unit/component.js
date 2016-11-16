import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { assert } from 'ember-metal/utils';
import Config from 'client/config/environment';

export default Component.extend({
  classNames: ['kitsu-ad'],

  init() {
    this._super(...arguments);
    assert('Must pass a `slot` param to an `{{ad-unit}}` component.', get(this, 'slot') !== undefined);
    set(this, 'client', Config.ads.client);
    set(this, 'isEnabled', Config.ads.enabled);
  },

  didInsertElement() {
    this._super(...arguments);
    window.adsbygoogle.push({});
  }
});
