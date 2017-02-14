import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { scheduleOnce } from 'ember-runloop';
import config from 'client/config/environment';
import injectScript from 'client/utils/inject-script';
import RSVP from 'rsvp';

let _scriptIsLoaded = false;
let _promise = null;

const loadGPTScript = () => {
  if (_scriptIsLoaded) {
    return RSVP.resolve();
  } else if (_promise) {
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

// @TODO: isPro support
export default Component.extend({
  classNames: ['kitsu-ad'],
  classNameBindings: ['isEnabled', 'isPro'],
  viewports: {
    mobile: [340, 400],
    tablet: [750, 200],
    desktop: [1050, 200]
  },
  viewport: service(),

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
    if (get(this, 'isEnabled')) {
      scheduleOnce('afterRender', () => {
        this._initAds();
      });
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (get(this, 'isEnabled')) {
      this._teardownViewport();
      const divId = get(this, 'adUnitId');
      window.googletag.destroySlots([divId]);
    }
  },

  _initAds() {
    loadGPTScript().then(() => {
      window.googletag.cmd.push(() => {
        this._setupViewport();
      });
    }).catch((error) => {
      // an error occurred, maybe blocked by an adblock or failed network request
      if (get(this, 'isDestroying') || get(this, 'isDestroyed')) { return; }
      set(this, 'isEnabled', false);
      console.warn('Ad: Failed to load GPT Script', error);
    });
  },

  _setupViewport() {
    const element = get(this, 'element');
    this.clearViewportCallback = get(this, 'viewport').onInViewportOnce(element, () => {
      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) { return; }
      this._deliverAd();
    });
  },

  _teardownViewport() {
    if (this.clearViewportCallback) {
      this.clearViewportCallback();
    }
  },

  _deliverAd() {
    const viewports = get(this, 'viewports');
    const sizes = get(this, 'sizes');

    // build responsive size mapping
    let mapping = window.googletag.sizeMapping();
    mapping.addSize([0, 0], [1, 1]);
    Object.keys(viewports).forEach((viewport) => {
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
    const initialSize = Object.values(sizes)[0];
    const slot = window.googletag.defineSlot(adUnitPath, initialSize || [], divId)
      .defineSizeMapping(mapping)
      .addService(window.googletag.pubads());

    window.googletag.display(divId);
    window.googletag.pubads().refresh([slot]);
  }
});
