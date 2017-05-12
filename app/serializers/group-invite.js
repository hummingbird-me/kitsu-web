import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    acceptedAt: { serialize: false },
    createdAt: { serialize: false },
    declinedAt: { serialize: false },
    revokedAt: { serialize: false }
  }
});
