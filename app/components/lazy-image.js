import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { assert } from 'ember-metal/utils';

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

  didInsertElement() {
    this._super(...arguments);
    const el = get(this, 'element');
    this.clearViewportCallback = get(this, 'viewport').onInViewportOnce(el, () => {
      this._loadImage();
    }, { ratio: get(this, 'ratio') || -1 });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.clearViewportCallback();
  },

  _loadImage() {
    this.$().attr('src', get(this, 'url'));
    this.$().one('error', () => {
      if (get(this, 'isDestroyed') === true) { return; }
      this.$().attr('src', get(this, 'placeholder') || '/images/default_poster.jpg');
    });
  }
});
