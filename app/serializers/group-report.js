import ApplicationSerializer from 'client/serializers/application';
import { isPresent } from '@ember/utils';

export default ApplicationSerializer.extend({
  attrs: {
    createdAt: { serialize: false },
    naughtyType: { serialize: false },
    naughtyId: { serialize: false }
  },

  serializeBelongsTo(snapshot, json, relationship) {
    const belongsTo = snapshot.belongsTo(relationship.key);
    if (isPresent(belongsTo)) {
      this._super(...arguments);
    }
  }
});
