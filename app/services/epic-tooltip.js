import Service from 'ember-service';

export default Service.extend({
  tooltips: [],

  register(component) {
    this.tooltips.addObject(component);
  },

  remove(component) {
    this.tooltips.removeObject(component);
  },

  all() {
    return this.tooltips;
  }
});
