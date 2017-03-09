import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    createdAt: { serialize: false },
    rank: { serialize: false }
  }
});
