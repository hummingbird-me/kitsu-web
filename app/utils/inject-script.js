import canUseDOM from 'client/utils/can-use-dom';
import RSVP from 'rsvp';

// @TODO: Create cache to keep track of added scripts and their results
function injectBrowser(src) {
  return new RSVP.Promise((resolve, reject) => {
    // Inject script into DOM (non-FastBoot)
    const element = document.createElement('script');
    element.async = true;
    element.src = src;
    element.onload = () => { resolve(); };
    element.onerror = () => { reject(); };
    const [head] = document.getElementsByTagName('head');
    head.appendChild(element);
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
