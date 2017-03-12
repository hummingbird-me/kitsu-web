import config from 'client/config/environment';
import canUseDOM from 'client/utils/can-use-dom';
import injectScript from 'client/utils/inject-script';

export function initialize() {
  // Adwords
  const { google } = config;
  if (canUseDOM && google.adwords) {
    injectScript('//www.googleadservices.com/pagead/conversion_async.js').catch(() => {});
  }

  // Canny
  if (canUseDOM) {
    const canny = function() {
      canny.q.push(arguments);
    };
    canny.q = [];
    window.Canny = canny;
    injectScript('https://canny.io/sdk.js').catch(() => {});
  }

  // Kill service workers
  if (canUseDOM) {
    if (window.navigator && window.navigator.serviceWorker) {
      window.navigator.serviceWorker.getRegistrations().then((workers) => {
        workers.forEach((worker) => {
          if (worker.scope === 'https://kitsu.io/') {
            worker.unregister();
          }
        });
      });
    }
  }
}

export default {
  name: 'browser-scripts',
  initialize
};
