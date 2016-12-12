import Ember from 'ember';
import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { scheduleOnce } from 'ember-runloop';

export default Component.extend({
  attributeBindings: ['alt', 'title'],
  classNames: ['lazy-image'],
  tagName: 'img',
  alt: undefined,
  title: undefined,
  placeholder: undefined,
  viewport: service(),

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
    if (get(this, 'isDestroyed') === true) { return; }
    const url = get(this, 'url');
    if (url === undefined) {
      this._handleError();
    } else {
      this.$().attr('src', url);
      this.$().one('error', () => this._handleError());
    }
  },

  _handleError() {
    if (get(this, 'isDestroyed') === true) { return; }
    if (get(this, 'fallback') !== undefined) {
      this.$().attr('src', get(this, 'fallback'));
      this.$().one('error', () => {
        if (get(this, 'isDestroyed') === true) { return; }
        this.$().attr('src', this._getPlaceholder());
      });
    } else {
      this.$().attr('src', this._getPlaceholder());
    }
  },

  _getPlaceholder() {
    return get(this, 'placeholder') || '/images/default_poster.jpg';
  }
});
