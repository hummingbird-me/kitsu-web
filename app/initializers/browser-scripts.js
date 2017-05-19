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
 * Inject Canny's SDK script into the `head` on initialization.
 */
function canny() {
  const c = function() {
    c.q.push(arguments);
  };
  c.q = [];
  window.Canny = c;
  injectScript('https://canny.io/sdk.js').catch(() => {});
}

/**
 * Inject Embedly's script into the `head` on initialzation.
 */
function embedly() {
  // setup defaults for embedly
  window.embedly = window.embedly || function() {
    (window.embedly.q = window.embedly.q || []).push(arguments);
  };
  window.embedly('defaults', {
    integrations: ['google'],
    cards: {
      key: config.embedly.apiKey,
      recommend: '0',
      controls: '0',
      chrome: '0',
      align: 'left',
      width: '100%'
    }
  });
  injectScript('https://cdn.embedly.com/widgets/platform.js').catch(() => {});
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
  canny();
  embedly();
}

export default {
  name: 'browser-scripts',
  initialize
};
