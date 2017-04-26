import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';

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
