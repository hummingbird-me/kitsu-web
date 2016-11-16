import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';

export default Component.extend({
  classNames: ['poster-wrapper'],
  media: undefined,
  trailerOpen: false,
  isHovering: false,

  mediaRoute: getter(function() {
    return `${get(this, 'media').constructor.modelName}.show`;
  }),

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
