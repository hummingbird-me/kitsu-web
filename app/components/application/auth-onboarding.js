import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  component: 'social-auth',
  componentName: computed('component', {
    get() {
      return `application/auth-onboarding/${get(this, 'component')}`;
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    this.$('.modal').modal('show');
  },

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
