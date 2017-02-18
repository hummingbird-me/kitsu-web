import Component from 'ember-component';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

export default Component.extend({
  classNames: ['media-sidebar'],

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'media.modelType') === 'anime') {
      get(this, 'getStreamersTask').perform();
    }
  },

  getStreamersTask: task(function* () {
    const media = get(this, 'media');
    const streamingLinks = media.hasMany('streamingLinks');
    if (streamingLinks.value()) {
      return yield RSVP.all(streamingLinks.value().map(streamingLink => (
        streamingLink.belongsTo('streamer').load()
      )));
    }
    return yield streamingLinks.load().then(records => (
      RSVP.all(records.map(record => record.belongsTo('streamer').load()))
    ));
  }).restartable()
});
