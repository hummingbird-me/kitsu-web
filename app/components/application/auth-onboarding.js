import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  component: 'social-auth',
  componentName: computed('component', function() {
    return `application/auth-onboarding/${get(this, 'component')}`;
  }),

  actions: {
    onClose() {
      invokeAction(this, 'onClose');
    },

    changeComponent(component, data) {
      set(this, 'component', component);
      set(this, 'componentData', data);
      this.$('.modal').data('bs.modal')._handleUpdate();
    },

    closeModal() {
      this.$('.modal').modal('hide');
    }
  }
});
