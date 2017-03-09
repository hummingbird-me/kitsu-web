import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    acceptedAt: { serialize: false },
    declinedAt: { serialize: false }
  }
});
