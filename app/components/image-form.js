import Component from '@ember/component';
import { set } from '@ember/object';
import { run } from '@ember/runloop';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    triggerFileSelect() {
      this.$('input').click();
    },

    selectedImage(event) {
      if (event.files && event.files[0]) {
        const reader = new FileReader();
        reader.onload = evt => run(() => {
          set(this, 'dataURI', evt.target.result);
          set(this, 'showCropperModal', true);
        });
        reader.readAsDataURL(event.files[0]);
      }
    },

    updateImage(data) {
      invokeAction(this, 'update', data);
    },

    closeModal() {
      this.$('input').val('');
      set(this, 'showCropperModal', false);
    }
  }
});
