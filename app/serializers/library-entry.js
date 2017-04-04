import ApplicationSerializer from 'client/serializers/application';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';

export default ApplicationSerializer.extend({
  metrics: service(),
  session: service(),

  attrs: {
    review: { serialize: false },
    unit: { serialize: false },
    nextUnit: { serialize: false }
  },

  serializeAttribute(snapshot, json, key) {
    this._super(...arguments);
    // If progress is changing and the status isn't current -- then we want to update the
    // status
    if (key === 'status' && snapshot.attr(key) !== 'current') {
      if ('progress' in snapshot.changedAttributes()) {
        json.attributes[key] = 'current'; // eslint-disable-line no-param-reassign
      }
    }

    if (key === 'ratingTwenty' && key in snapshot.changedAttributes()) {
      if (get(this, 'session.hasUser')) {
        get(this, 'session.account').incrementProperty('ratingsCount');
      }

      // If rating is changed we want to send that data to Stream
      const media = get(snapshot, 'record.media');
      const mediaType = capitalize(get(media, 'modelType'));
      get(this, 'metrics').invoke('trackEngagement', 'Stream', {
        label: 'rating',
        content: `${mediaType}:${get(media, 'id')}`,
        boost: json.attributes[key]
      });
    }
  }
});
