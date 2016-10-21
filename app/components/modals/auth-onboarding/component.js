import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { invokeAction } from 'ember-invoke-action';

/**
 * This component should be invoked within a wormhole.
 */
export default Component.extend({
  _component: 'social-auth',
  componentName: computed('_component', {
    get() {
      return `modals/auth-onboarding/${get(this, '_component')}`;
    }
  }),

  actions: {
    onClose() {
      invokeAction(this, 'onClose');
    },

    changeComponent(component) {
      set(this, '_component', component);
      this.$('.modal').data('bs.modal')._handleUpdate();
    },

    closeModal() {
      this.$('.modal').modal('hide');
    }
  }
});
