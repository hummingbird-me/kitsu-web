import config from 'client/config/environment';
import canUseDOM from 'client/utils/can-use-dom';
import injectScript from 'client/utils/inject-script';

function canny() {
  const c = function() {
    c.q.push(arguments);
  };
  c.q = [];
  window.Canny = c;
  injectScript('//canny.io/sdk.js').catch(() => {});
}

function embedly() {
  window.embedly = window.embedly || function() {
    (window.embedly.q = window.embedly.q || []).push(arguments);
  };
  window.embedly('defaults', {
    integrations: ['google'],
    cards: {
      key: config.embedly.apiKey,
      recommend: '0',
      controls: '0',
      align: 'left'
    }
  });
  injectScript('//cdn.embedly.com/widgets/platform.js').catch(() => {});
}

export function initialize() {
  if (!canUseDOM) { return; }

  // Adwords
  const { google } = config;
  if (google.adwords) {
    injectScript('//www.googleadservices.com/pagead/conversion_async.js').catch(() => {});
  }

  // Canny
  canny();

  // Embedly
  embedly();

  // Kill service workers
  if (window.navigator && window.navigator.serviceWorker) {
    window.navigator.serviceWorker.getRegistrations().then((workers) => {
      workers.forEach((worker) => {
        if (worker.scope === 'https://kitsu.io/') {
          worker.unregister();
        }
      });
    });
    // remove caches
    [
      'esw-index-1', 'esw-index-2',
      'asset-cache-1', 'asset-cache-2', 'asset-cache-3',
      'esw-cache-first-1'
    ].forEach((cache) => {
      caches.delete(cache).then(() => {}).catch(() => {});
    });
  }
}

export default {
  name: 'browser-scripts',
  initialize
};
