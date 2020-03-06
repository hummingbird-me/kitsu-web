import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload) {
    payload.data.forEach(data => {
      if (data.attributes.isSeen === undefined || data.attributes.isSeen === null) {
        delete data.attributes.isSeen; // eslint-disable-line no-param-reassign
        delete data.attributes.isRead; // eslint-disable-line no-param-reassign
      }
    });
    return this._super(...arguments);
  }
});
