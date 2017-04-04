import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import canUseDOM from 'client/utils/can-use-dom';

export default Component.extend({
  tagName: '',
  rating: 1,

  didInsertElement() {
    this._super(...arguments);
    if (!canUseDOM) { return; }
    this._createHandleDOM();
    this._updateHandle(get(this, 'rating'));
  },

  actions: {
    onSlide([rating]) {
      this._updateHandle(rating);
    },

    onClick([rating]) {
      invokeAction(this, 'onClick', rating);
    }
  },

  _createHandleDOM() {
    const [slider] = document.getElementsByClassName('advanced-rating-slider');
    const [element] = slider.getElementsByClassName('noUi-handle');
    const handleDot = document.createElement('div');
    handleDot.classList.add('noUi-handle-dot');
    element.appendChild(handleDot);
    const handleBackground = document.createElement('span');
    handleBackground.classList.add('noUi-handle-background');
    handleBackground.style.width = `${slider.clientWidth}px`;
    handleDot.appendChild(handleBackground);
  },

  _updateHandle(rating) {
    const value = ((rating - 1) * 10);
    const [element] = document.getElementsByClassName('advanced-rating-slider');
    const offset = -((value / 100) * element.clientWidth);
    const [handle] = element.getElementsByClassName('noUi-handle-background');
    handle.style.left = `${offset}px`;
  }
});
