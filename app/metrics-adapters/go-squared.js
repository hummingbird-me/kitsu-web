import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { get } from '@ember/object';
import { compact, without } from 'ember-metrics/utils/object-transforms';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'GoSquared';
  },

  init() {
    const { id } = get(this, 'config');
    /* eslint-disable */
    !function(g,s,q,r,d){r=g[r]=g[r]||function(){(r.q=r.q||[]).push(
    arguments)};d=s.createElement(q);q=s.getElementsByTagName(q)[0];
    d.src='//d1l6p2sc9645hc.cloudfront.net/tracker.js';q.parentNode.
    insertBefore(d,q)}(window,document,'script','_gs');
    /* eslint-enable */
    if (window._gs && id) {
      window._gs(id, false);
    }
  },

  identify(options = {}) {
    const { distinctId: id, name, email } = options;
    if (window._gs) {
      window._gs('identify', { id, name, email });
    }
  },

  unidentify() {
    if (window._gs) {
      window._gs('unidentify');
    }
  },

  trackPage(options = {}) {
    const { page, title } = options;
    if (window._gs) {
      window._gs('track', page, title);
    }
  },

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { eventName } = compactedOptions;
    if (!eventName) { return; }

    if (window._gs) {
      window._gs('event', eventName, without(compactedOptions, 'eventName') || {});
    }
  },

  willDestroy() {
    document.querySelectorAll('script[src*="//d1l6p2sc9645hc.cloudfront.net/tracker.js"]')
      .forEach(element => {
        element.remove();
      });
  }
});
