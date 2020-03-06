import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { get } from '@ember/object';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'TwitterPixel';
  },

  init() {
    const { id } = get(this, 'config');
    /* eslint-disable */
    !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
    },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
    a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
    /* eslint-enable */
    window.twq('init', id);
  },

  trackPage(options = {}) {
    window.twq('track', 'PageView', options);
  },

  trackEvent() {},

  willDestroy() {
    document.querySelectorAll('script[src*="//static.ads-twitter.com/uwt.js"]').forEach(element => {
      element.remove();
    });
    document.querySelectorAll('script[src*="analytics.twitter.com"]').forEach(element => {
      element.remove();
    });
  }
});
