import Service from 'ember-service';

export default Service.extend({
  tooltips: [],

  register(component) {
    this.tooltips.addObject(component);
  },

  all() {
    return this.tooltips;
  }
});
