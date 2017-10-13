import ApplicationSerializer from 'client/serializers/application';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';

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

    if (key === 'ratingTwenty' && key in snapshot.changedAttributes()) {
      get(this, 'session.account').incrementProperty('ratingsCount');

      // If rating is changed we want to send that data to Stream
      if (!isNaN(json.attributes[key])) {
        const media = get(snapshot, 'record.media');
        const mediaType = capitalize(get(media, 'modelType'));
        get(this, 'metrics').invoke('trackEngagement', 'Stream', {
          label: 'rating',
          content: `${mediaType}:${get(media, 'id')}`,
          boost: json.attributes[key]
        });
      }
    }
  }
});
