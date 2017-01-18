import config from 'client/config/environment';
import canUseDOM from 'ember-metrics/utils/can-use-dom';

export function initialize() {
  const { adwords, ads: { enabled, client } } = config.google;
  // google adwords
  if (canUseDOM && adwords) {
    const element = document.createElement('script');
    element.async = true;
    element.src = '//www.googleadservices.com/pagead/conversion_async.js';
    const script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(element, script);
  }

  // google adsense
  if (canUseDOM && enabled) {
    const element = document.createElement('script');
    element.async = true;
    element.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    element.onload = () => {
      (window.adsbygoogle || []).push({
        google_ad_client: client,
        enable_page_level_ads: true
      });
    };
    const script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(element, script);
  }
}

export default {
  name: 'google',
  initialize
};
