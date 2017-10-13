import Component from '@ember/component';
import { get, set, computed } from '@ember/object';

export default Component.extend({
  modalBase: null,
  component: null,

  componentName: computed('modalBase', 'component', function() {
    const modalBase = get(this, 'modalBase');
    const component = get(this, 'component');
    return `${modalBase}/${component}`;
  }).readOnly(),

  actions: {
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
