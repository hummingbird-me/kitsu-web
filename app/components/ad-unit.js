import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { scheduleOnce } from 'ember-runloop';
import config from 'client/config/environment';
import injectScript from 'client/utils/inject-script';
import RSVP from 'rsvp';

let _scriptIsLoaded = false;
let _adSensePromise = null;

const loadGoogleAdSense = (client, pageads) => {
  if (_scriptIsLoaded) {
    return RSVP.resolve();
  } else if (_adSensePromise) {
    return _adSensePromise;
  }

  const src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  _adSensePromise = injectScript(src).then(() => {
    _scriptIsLoaded = true;
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({
      google_ad_client: client,
      enable_page_level_ads: pageads
    });
  });
  return _adSensePromise;
};

export default Component.extend({
  classNames: ['kitsu-ad'],
  classNameBindings: ['isEnabled', 'isPro'],
  format: 'auto',

  init() {
    this._super(...arguments);
    const { google: { ads } } = config;
    set(this, 'googleConfig', ads);
    set(this, 'client', ads.client);
    set(this, 'isEnabled', ads.enabled);
  },

  didInsertElement() {
    this._super(...arguments);
    if (!get(this, 'isEnabled')) { return; }
    scheduleOnce('afterRender', () => {
      this._initAds();
    });
  },


  /**
   * Inject the Google Ad script into the DOM and display an ad
   */
  _initAds() {
    const { client, pageads } = get(this, 'googleConfig');
    loadGoogleAdSense(client, pageads).then(() => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }).catch((error) => {
      // an error occurred, maybe blocked by an adblock or failed network request
      if (get(this, 'isDestroying') || get(this, 'isDestroyed')) { return; }
      set(this, 'isEnabled', false);
      get(this, 'raven').captureException(error);
    });
  },
});
