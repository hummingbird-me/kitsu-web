import ApplicationSerializer from 'client/application/serializer';

export default ApplicationSerializer.extend({
  attrs: {
    likesCount: { serialize: false },
    repliesCount: { serialize: false }
  }
});
