import Service from 'ember-service';

export default Service.extend({
  subscribers: {},
  listenerSetup: false,

  setupListener() {
    if (this.listenerSetup || !window.embedly) { return; }
    window.embedly('on', 'card.resize', this.onRender);
    this.listenerSetup = true;
  },

  onRender(iframe) {
    console.log(iframe);
  }
});
