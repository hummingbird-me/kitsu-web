import ApplicationSerializer from 'client/models/application/serializer';

export default ApplicationSerializer.extend({
  attrs: {
    likesCount: { serialize: false },
    repliesCount: { serialize: false }
  }
});
