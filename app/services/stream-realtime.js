import Service from 'ember-service';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Config from 'client/config/environment';

export default Service.extend({
  init() {
    this._super(...arguments);
    if (window.stream !== undefined) {
      const { key, app } = get(Config, 'stream.realtime');
      const client = window.stream.connect(key, null, app);
      set(this, 'client', client);
    }
  },

  subscribe(feed, id, token, callback) {
    const connection = get(this, 'client').feed(feed, id, token);
    return connection.subscribe(data => callback(data));
  }
});
