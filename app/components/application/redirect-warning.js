import Component from '@ember/component';
import { get, set } from '@ember/object';

export default Component.extend({
  isShown: window.explainRedirect && !window.localStorage.getItem('hide-redirect-warning'),

  actions: {
    dismiss() {
      window.localStorage.setItem('hide-redirect-warning', '1');
      set(this, 'isShown', false);
    }
  }
});
