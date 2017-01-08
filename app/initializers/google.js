import config from 'client/config/environment';

export function initialize() {
  const { adwords, ads: { enabled } } = config.google;
  // google adwords
  if (adwords) {
    const element = document.createElement('script');
    element.async = true;
    element.src = '//www.googleadservices.com/pagead/conversion_async.js';
    const script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(element, script);
  }

  // google adsense
  if (enabled) {
    const element = document.createElement('script');
    element.async = true;
    element.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    const script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(element, script);
  }
}

export default {
  name: 'google',
  initialize
};
