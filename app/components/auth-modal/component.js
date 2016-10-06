import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';

/**
 * This component should be invoked within a wormhole.
 */
export default Component.extend({
  /**
   * `auth-modal/social-auth` is the default view for authentication.
   */
  _component: 'social-auth',
  componentName: computed('_component', {
    get() {
      return `auth-modal/${get(this, '_component')}`;
    }
  }),

  /**
   * TODO: Remove after testing
   */
  didInsertElement() {
    this.$('.modal').modal();
  },

  actions: {
    changeComponent(component) {
      set(this, '_component', component);
      this.$('.modal').data('bs.modal')._handleUpdate();
    },

    close() {
      this.$('.modal').modal('hide');
    }
  }
});
