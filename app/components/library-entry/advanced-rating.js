import Component from 'ember-component';
import get from 'ember-metal/get';
import { task, timeout } from 'ember-concurrency';
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

  debounceClick: task(function* (rating) {
    yield timeout(500);
    invokeAction(this, 'onClick', rating);
  }).restartable(),

  actions: {
    onSlide([rating]) {
      this._updateHandle(rating);
    },

    onClick([rating]) {
      get(this, 'debounceClick').perform(rating);
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
    if (!element) { return; }
    const offset = -((value / 100) * element.clientWidth);
    const [handle] = element.getElementsByClassName('noUi-handle-background');
    handle.style.left = `${offset}px`;
  }
});
