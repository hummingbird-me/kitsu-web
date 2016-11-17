import Component from 'ember-component';
import set from 'ember-metal/set';

export default Component.extend({
  classNames: ['poster-wrapper'],
  media: undefined,
  trailerOpen: false,
  isHovering: false,

  mouseEnter() {
    set(this, 'isHovering', true);
  },

  mouseLeave() {
    set(this, 'isHovering', false);
  },

  actions: {
    openTrailer() {
      set(this, 'trailerOpen', true);
    },

    closeTrailer() {
      set(this, 'trailerOpen', false);
    }
  }
});
