import Service from '@ember/service';
import { get } from '@ember/object';
import Config from 'client/config/environment';

export default Service.extend({
  /**
   * Setup GetStream connection to the correct Feed Group.
   */
  init() {
    this._super(...arguments);
    if (!window.stream) { return; }
    const { enabled, config } = get(Config, 'stream.realtime');
    const { app, key } = get(config, Config.kitsu.env);
    if (!enabled) { return; }
    this.client = window.stream.connect(key, null, app);
  },

  /**
   * Subscribe to a specific feed in the connected feed group. This opens a websocket connection
   * with GetStream that will send updates on new and deleted activities for the feed. Connection
   * can be closed by calling `.cancel()` on the returned value.
   *
   * @param {String} feed The name of the feed in GetStream
   * @param {String} id The id of the specific feed
   * @param {String} token Read only token for the feed returned from the API
   * @param {Function} callback
   */
  subscribe(feed, id, token, callback) {
    if (!this.client) { return; }
    return this.client.feed(feed, id, token).subscribe(data => {
      callback(data);
    });
  }
});
