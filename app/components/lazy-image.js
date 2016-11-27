import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { assert } from 'ember-metal/utils';
import { scheduleOnce } from 'ember-runloop';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  attributeBindings: ['alt', 'title'],
  classNames: ['lazy-image'],
  tagName: 'img',

  alt: undefined,
  title: undefined,
  placeholder: undefined,

  init() {
    this._super(...arguments);
    assert('Must pass url to {{lazy-image}}', get(this, 'src') !== undefined);
    set(this, 'viewportTolerance', Object.assign({ top: 200, bottom: 200, left: 0, right: 0 }, get(this, 'tolerance') || {}));
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'srcWas') !== undefined && get(this, 'src') !== get(this, 'srcWas')) {
      scheduleOnce('afterRender', () => this._loadImage());
    }
    set(this, 'srcWas', get(this, 'src'));
  },

  didInsertElement() {
    this._super(...arguments);
    this.$().attr('src', get(this, 'placeholder') || '/images/default_poster.jpg');
  },

  didEnterViewport() {
    this._super(...arguments);
    this._loadImage();
  },

  _loadImage() {
    this.$().attr('src', get(this, 'src'));

    // if there was an error loading the image, then switch to placeholder
    // TODO -- Actually use a good placeholder (logo?)
    this.$().one('error', () => {
      if (get(this, 'isDestroyed') === true) { return; }
      this.$().attr('src', get(this, 'placeholder') || '/images/default_poster.jpg');
    });
  }
});
