import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'client/config/environment';
import injectScript from 'client/utils/inject-script';
import RSVP from 'rsvp';

/**
 * Borrowed from Discourse's method of loading scripts by Components.
 * This allows us to skip loading and injecting this script for PRO users.
 */
let _scriptIsLoaded = false;
let _promise = null;
const loadGPTScript = () => {
  if (_scriptIsLoaded) {
    return RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  const src = '//www.googletagservices.com/tag/js/gpt.js';
  _promise = injectScript(src).then(() => {
    _scriptIsLoaded = true;
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    window.googletag.cmd.push(() => {
      window.googletag.pubads().enableSingleRequest();
      window.googletag.pubads().disableInitialLoad();
      window.googletag.pubads().collapseEmptyDivs();
      window.googletag.enableServices();
    });
  });
  return _promise;
};

/**
 * Renders a GPT responsive ad unit.
 *
 *  {{ad-unit unit="<ad_unit_code>" sizes=(hash
 *    mobile=(array ...)
 *    tablet=(array ...)
 *    desktop=(array ...)
 *  )}}
 *
 * @TODO: Can observe the viewport size and refresh ads when it drops below a breakpoint.
 * @TODO: Can be extracted into a more generalized/supported addon.
 */
export default Component.extend({
  classNames: ['kitsu-ad'],
  classNameBindings: ['isEnabled'],
  /** Default viewport breakpoints (width, height) */
  viewports: {
    mobile: [340, 400],
    tablet: [750, 200],
    desktop: [1024, 200]
  },
  session: service(),

  adUnitPath: computed('unit', function() {
    const { networkId } = get(this, 'googleConfig');
    return `/${networkId}/${get(this, 'unit')}`;
  }),

  init() {
    this._super(...arguments);
    const { google: { ads } } = config;
    const { enabled } = ads;
    set(this, 'googleConfig', ads);
    set(this, 'isEnabled', enabled);
    set(this, 'adUnitId', `gpt-ad-unit-${get(this, 'elementId')}`);
  },

  didInsertElement() {
    this._super(...arguments);
    // don't continue if this is a PRO user
    if (get(this, 'session.hasUser') && get(this, 'session.account.isPro')) {
      return;
    }

    if (get(this, 'isEnabled')) {
      this._initAd();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (get(this, 'isEnabled')) {
      this._destroyAd();
    }
  },

  /** Initializes the loading of the GPT script and catches failed loads */
  _initAd() {
    loadGPTScript().then(() => {
      if (get(this, 'isDestroyed')) { return; }
      // API might not be ready yet.
      window.googletag.cmd = window.googletag.cmd || [];
      window.googletag.cmd.push(() => {
        if (get(this, 'isDestroyed')) { return; }
        this._deliverAd();
      });
    }).catch(() => {
      // an error occurred, maybe blocked by an adblock or failed network request
      if (get(this, 'isDestroyed')) { return; }
      set(this, 'isEnabled', false);
    });
  },

  _destroyAd() {
    const slotRef = get(this, 'adSlotRef');
    if (window.googletag && window.googletag.defineSlots && slotRef) {
      window.googletag.destroySlots([slotRef]);
    }
  },

  /** Setup all the GPT code required to deliver this ad */
  _deliverAd() {
    const viewports = get(this, 'viewports');
    const sizes = get(this, 'sizes');

    // build responsive size mapping
    let mapping = window.googletag.sizeMapping();
    mapping.addSize([0, 0], [1, 1]);
    Object.keys(viewports).forEach(viewport => {
      const viewportSize = viewports[viewport];
      const adSizes = sizes[viewport];
      if (adSizes) {
        mapping.addSize(viewportSize, adSizes);
      }
    });
    mapping = mapping.build();

    // define the ad slot
    const adUnitPath = get(this, 'adUnitPath');
    const divId = get(this, 'adUnitId');
    const targeting = get(this, 'targeting') || {};
    const initialSize = Object.values(sizes)[0];
    const slot = window.googletag.defineSlot(adUnitPath, initialSize || [], divId)
      .defineSizeMapping(mapping)
      .addService(window.googletag.pubads());
    Object.keys(targeting).forEach(targetingKey => {
      slot.setTargeting(targetingKey, targeting[targetingKey]);
    });
    set(this, 'adSlotRef', slot);

    // request and refresh the ad
    window.googletag.display(divId);
    window.googletag.pubads().refresh([slot]);
  }
});
