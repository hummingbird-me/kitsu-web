import config from 'client/config/environment';
import canUseDOM from 'client/utils/can-use-dom';
import injectScript from 'client/utils/inject-script';

export function initialize() {
  const { google } = config;
  if (canUseDOM && google.adwords) {
    injectScript('//www.googleadservices.com/pagead/conversion_async.js').catch(() => {});
  }
}

export default {
  name: 'browser-scripts',
  initialize
};
