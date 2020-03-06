import Component from '@ember/component';
import { get, set } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import canUseDOM from 'client/utils/can-use-dom';
import { readDOM, mutateDOM } from 'ember-batcher/batcher';

export default Component.extend({
  tagName: '',
  rating: 1,

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'rating', get(this, 'rating') || 1);
  },

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
    formatValue(value) {
      return parseFloat(parseFloat(value).toFixed(1));
    },

    onSlide(rating) {
      this._updateHandle(rating);
    },

    onClick(rating) {
      get(this, 'debounceClick').perform(rating);
    }
  },

  _createHandleDOM() {
    const slider = document.getElementsByClassName('advanced-rating-slider')[0];
    const element = slider.getElementsByClassName('noUi-handle')[0];
    const handleDot = document.createElement('div');
    handleDot.classList.add('noUi-handle-dot');
    const handleBackground = document.createElement('span');
    handleBackground.classList.add('noUi-handle-background');
    readDOM(() => {
      if (get(this, 'isDestroyed')) { return; }
      const width = slider.clientWidth;
      mutateDOM(() => {
        if (get(this, 'isDestroyed')) { return; }
        handleBackground.style.width = `${width}px`;
        element.appendChild(handleDot);
        handleDot.appendChild(handleBackground);
      });
    });
  },

  _updateHandle(rating) {
    const value = ((rating - 1) * 10);
    const element = document.getElementsByClassName('advanced-rating-slider')[0];
    if (!element) { return; }
    readDOM(() => {
      if (get(this, 'isDestroyed')) { return; }
      const offset = -((value / 100) * element.clientWidth);
      mutateDOM(() => {
        if (get(this, 'isDestroyed')) { return; }
        const handle = element.getElementsByClassName('noUi-handle-background')[0];
        handle.style.left = `${offset}px`;
      });
    });
  },
});
