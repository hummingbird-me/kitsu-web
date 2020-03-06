import canUseDOM from 'client/utils/can-use-dom';
import RSVP from 'rsvp';

const _scriptsLoaded = {};
const _scriptsLoading = {};

function injectBrowser(src) {
  return new RSVP.Promise((resolve, reject) => {
    // script has been loaded in the past or is currently loading
    if (_scriptsLoaded[src]) {
      return resolve();
    } if (_scriptsLoading[src]) {
      return _scriptsLoading[src].then(() => { resolve(); });
    }

    // add the new script to our loading cache
    let done;
    _scriptsLoading[src] = new RSVP.Promise(_resolve => {
      done = _resolve;
    });
    _scriptsLoading[src].then(() => {
      delete _scriptsLoading[src];
    });

    // Inject script into DOM (non-FastBoot)
    const element = document.createElement('script');
    element.async = true;
    element.src = src;
    element.onload = () => {
      _scriptsLoaded[src] = true;
      done();
      resolve();
    };
    element.onerror = () => {
      done();
      reject();
    };
    document.head.appendChild(element);
  });
}

/**
 * Injects a script into the DOM.
 *
 * @export
 * @param {String} src
 * @returns {RSVP.Promise}
 */
export function injectScript(src) {
  if (canUseDOM) {
    return injectBrowser(src);
  }
}

export default injectScript;
