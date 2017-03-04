import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { bind } from 'ember-runloop';
import { invoke, invokeAction } from 'ember-invoke-action';
/* global Cropper */

export default Component.extend({
  width: computed('_width', function() {
    return get(this, '_width');
  }).readOnly(),

  height: computed('_height', function() {
    return get(this, '_height');
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);
    const image = document.getElementById(`${get(this, 'elementId')}-image`);
    this._cropEventFn = bind(this, '_updateDimensions');
    image.addEventListener('crop', this._cropEventFn);
    const cropper = new Cropper(image, {
      viewMode: 1,
      autoCropArea: 0.5,
      scalable: false,
      minContainerWidth: 500,
      minContainerHeight: 300
    });
    set(this, 'cropper', cropper);
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this._cropEventFn) {
      const image = document.getElementById(`${get(this, 'elementId')}-image`);
      image.removeEventListener('crop', this._cropEventFn);
    }
  },

  actions: {
    closeModal() {
      this.$('.modal').on('hidden.bs.modal', () => {
        invokeAction(this, 'onClose');
      }).modal('hide');
    },

    updateImage() {
      const cropper = get(this, 'cropper');
      const dataURI = cropper.getCroppedCanvas().toDataURL();
      invokeAction(this, 'update', dataURI);
      invoke(this, 'closeModal');
    }
  },

  _updateDimensions() {
    const cropper = get(this, 'cropper');
    const data = cropper.getData();
    set(this, '_width', Math.round(data.width));
    set(this, '_height', Math.round(data.height));
  }
});
