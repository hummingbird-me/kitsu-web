import Mixin from 'ember-metal/mixin';

export default Mixin.create({
  activate() {
    this._super(...arguments);
    document.body.classList.add('slide-header');
  },

  deactivate() {
    this._super(...arguments);
    document.body.classList.remove('slide-header');
  }
});
