import config from 'client/config/environment';
import canUseDOM from 'client/utils/can-use-dom';
import injectScript from 'client/utils/inject-script';

export function initialize() {
  const { google } = config;
  if (canUseDOM) {
    if (google.adwords) {
      injectScript('//www.googleadservices.com/pagead/conversion_async.js');
    }
    const { ads } = google;
    if (ads.enabled) {
      injectScript('//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js').then(() => {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({
          google_ad_client: ads.client,
          enable_page_level_ads: ads.pageads
        });
      });
    }
  }
}

export default {
  name: 'browser-scripts',
  initialize
};
