import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { run } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import { invokeAction } from 'ember-invoke-action';
import { image } from 'client/helpers/image';
import errorMessage from 'client/utils/error-messages';

export default Component.extend({
  tab: 'about-me',

  coverImageStyle: computed('user.coverImage', function() {
    const coverImage = image(get(this, 'user.coverImage'));
    return htmlSafe(`background-image: url("${coverImage}")`);
  }).readOnly(),

  actions: {
    triggerClick(elementId) {
      this.$(`#${elementId}`).click();
    },

    updateImage(property, event) {
      if (event.files && event.files[0]) {
        const reader = new FileReader();
        reader.onload = evt => run(() => {
          set(this, property, evt.target.result);
        });
        reader.onerror = err => {
          invokeAction(this, 'onError', errorMessage(err));
        };
        reader.readAsDataURL(event.files[0]);
      }
    },

    changeTab(tab) {
      set(this, 'tab', tab);
      invokeAction(this, 'onChange', tab);
    }
  }
});
