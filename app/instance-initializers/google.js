import config from 'client/config/environment';

/**
 * Checks if the script has already been added to the DOM, this prevents the Ember initialization
 * adding a second script after FastBoot (if running FastBoot).
 */
function _doesScriptExist(DOM, src) {
  let child = DOM.head.firstChild;
  while (child !== DOM.head.lastChild) {
    if (child.nodeName === 'SCRIPT') {
      const attr = child.getAttribute('src');
      if (attr === src) { return true; }
    }
    child = child.nextSibling;
  }
  return false;
}

function _addGoogleAdWords(DOM) {
  const { adwords } = config.google;
  const src = '//www.googleadservices.com/pagead/conversion_async.js';
  if (_doesScriptExist(DOM, src) || !adwords) { return; }
  const element = DOM.createElement('script');
  element.setAttribute('async', '');
  element.setAttribute('src', src);
  DOM.head.appendChild(element);
}

function _addGoogleAdSense(DOM) {
  const { ads: { enabled, client, pageads } } = config.google;
  const src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  if (_doesScriptExist(DOM, src) || !enabled) { return; }
  const element = DOM.createElement('script');
  element.setAttribute('async', '');
  element.setAttribute('src', src);
  const initElement = DOM.createElement('script');
  const child = DOM.createTextNode(`
    (adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "${client}",
      enable_page_level_ads: ${pageads}
    });
  `);
  initElement.appendChild(child);
  DOM.head.appendChild(element);
  DOM.head.appendChild(initElement);
}

/**
 * Inject Google `<script/>` elements into the DOM either at FastBoot's rendering time, or Ember's
 * initialization.
 */
export function initialize(application) {
  const DOM = application.lookup('service:-document');
  if (DOM) {
    _addGoogleAdWords(DOM);
    _addGoogleAdSense(DOM);
  }
}

export default {
  name: 'google',
  initialize
};
