import config from 'client/config/environment';
import canUseDOM from 'client/utils/can-use-dom';
import injectScript from 'client/utils/inject-script';

/**
 * Inject Google AdWords conversion script into the `head` on initialization.
 */
function adwords() {
  const { google } = config;
  if (google.adwords) {
    injectScript('https://www.googleadservices.com/pagead/conversion_async.js').catch(() => {});
  }
}

/**
 * Inject Nolt's SDK script into the `head` on initialization.
 */
function nolt() {
  window.noltQueue = window.noltQueue || [];
  window.nolt = function() {
    noltQueue.push(arguments); /* eslint no-undef: "off" */
  };
  injectScript('https://cdn.nolt.io/widgets.js').catch(() => {});
}

/**
 * Inject OneSignal's script into the `head` on initialzation.
 */
function onesignal() {
  window.OneSignal = window.OneSignal || [];
  window.OneSignal.push(['init', {
    appId: config.onesignal[config.kitsu.env].appId,
    allowLocalhostAsSecureOrigin: true,
    autoRegister: false,
    notifyButton: { enable: false },
    persistNotification: false,
    welcomeNotification: { title: 'Kitsu' },
    promptOptions: {
      // actionMessage limited to 90 characters
      actionMessage: 'Enable notifications to stay updated on all the new activity.',
      // acceptButtonText limited to 15 characters
      acceptButtonText: 'SURE!',
      // cancelButtonText limited to 15 characters
      cancelButtonText: 'NO THANKS'
    }
  }]);
  injectScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js').catch(() => {});
}

export function initialize() {
  // Don't bother if we don't have DOM access, FastBoot?
  if (!canUseDOM) { return; }

  if (config.kitsu.isStaging) {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
  }

  // Inject scripts
  adwords();
  nolt();
  onesignal();
}

export default {
  name: 'browser-scripts',
  initialize
};
