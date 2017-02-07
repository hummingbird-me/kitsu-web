import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
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
  }
});
