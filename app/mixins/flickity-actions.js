import Mixin from 'ember-metal/mixin';
import set from 'ember-metal/set';
import { later } from 'ember-runloop';

/**
 * Enables the `ember-href-to` `data-href-to-ignore` property if Flickity is in
 * a dragging state.
 */
export default Mixin.create({
  isFlickityDragging: false,

  _onDragStart() {
    set(this, 'isFlickityDragging', true);
    this.$('a[href^="/"]').attr('data-href-to-ignore', true);
  },

  _onDragEnd() {
    // 250ms later so that we don't instantly remove the attribute and then have href-to proc.
    later(() => {
      set(this, 'isFlickityDragging', false);
      this.$('a[href^="/"]').removeAttr('data-href-to-ignore');
    }, 250);
  },

  actions: {
    flickityOnDragStart() {
      this._onDragStart();
    },

    flickityOnDragEnd() {
      this._onDragEnd();
    }
  }
});
