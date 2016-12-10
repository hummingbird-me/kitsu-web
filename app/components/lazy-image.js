import Ember from 'ember';
import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { assert } from 'ember-metal/utils';
import { scheduleOnce } from 'ember-runloop';

const DEFAULT = /\/images\/default_\S+/;

export default Component.extend({
  attributeBindings: ['alt', 'title'],
  classNames: ['lazy-image'],
  tagName: 'img',
  alt: undefined,
  title: undefined,
  placeholder: undefined,
  viewport: service(),

  init() {
    this._super(...arguments);
    assert('Must pass url to {{lazy-image}}', get(this, 'url') !== undefined);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    scheduleOnce('afterRender', () => {
      if (Ember.testing) {
        this._loadImage();
      } else {
        const el = get(this, 'element');
        this.clearViewportCallback = get(this, 'viewport').onInViewportOnce(el, () => {
          this._loadImage();
        }, { ratio: get(this, 'ratio') || -1 });
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.clearViewportCallback) {
      this.clearViewportCallback();
    }
  },

  _loadImage() {
    // initial image might be blank and therefore use the defaultValue of the ember data transform.
    let url = get(this, 'url');
    if (DEFAULT.test(url)) {
      url = this._getPlaceholder();
    }
    this.$().attr('src', url);
    this.$().one('error', () => {
      if (get(this, 'isDestroyed') === true) { return; }
      this.$().attr('src', this._getPlaceholder());
    });
  },

  _getPlaceholder() {
    return get(this, 'placeholder') || '/images/default_poster.jpg';
  }
});
