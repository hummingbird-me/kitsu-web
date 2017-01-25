import config from 'client/config/environment';

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
  const element = DOM.createRawHTMLSection(`<script async src="${src}"></script>`);
  DOM.head.appendChild(element);
}

function _addGoogleAdSense(DOM) {
  const { ads: { enabled, client } } = config.google;
  const src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  if (_doesScriptExist(DOM, src) || !enabled) { return; }
  const element = DOM.createRawHTMLSection(`
    <script async src="${src}"></script>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "${client}",
        enable_page_level_ads: true
      });
    </script>
  `);
  DOM.head.appendChild(element);
}

/**
 * Inject Google `<script/>` elements into the DOM either at fastboots rendering time, or embers
 * initialization.
 *
 * Once we are shipping fastboot to all users the support for non-fastboot could be removed.
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
