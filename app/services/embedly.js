import Service from '@ember/service';

export default Service.extend({
  subscribers: {},
  listenerSetup: false,

  setupListener() {
    if (this.listenerSetup || !window.embedly) { return; }
    const onResize = () => { this.onResize(); };
    window.embedly('on', 'card.resize', onResize);
    this.listenerSetup = true;
  },

  addSubscription(guid, callback) {
    if (this.subscribers[guid]) { return; }
    this.subscribers[guid] = callback;
  },

  removeSubscription(guid) {
    delete this.subscribers[guid];
  },

  onResize(iframe) {
    Object.values(this.subscribers).forEach((subscriber) => {
      subscriber(iframe);
    });
  }
});
