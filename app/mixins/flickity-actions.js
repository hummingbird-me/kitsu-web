import Mixin from 'ember-metal/mixin';
import set from 'ember-metal/set';
import { later } from 'ember-runloop';
import canUseDOM from 'ember-metrics/utils/can-use-dom';

/**
 * This Mixin disables all <a/> HTML elements that use `ember-href-to` when flickity is
 * actively dragging, and provides a flag that actions can check against to determine wether
 * to fire or not.
 */
export default Mixin.create({
  isFlickityDragging: false,

  didRender() {
    this._super(...arguments);
    if (canUseDOM) {
      this._cleanEvents();
      this._setupEvents();
    }
  },

  _cleanEvents() {
    this.$('.flickity-enabled').off('dragStart.flickity').off('dragEnd.flickity');
  },

  _setupEvents() {
    this.$('.flickity-enabled').on('dragStart.flickity', () => {
      this._onDragStart();
    }).on('dragEnd.flickity', () => {
      this._onDragEnd();
    });
  },

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
  }
});
