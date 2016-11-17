import ApplicationSerializer from 'client/models/application/serializer';

export default ApplicationSerializer.extend({
  attrs: {
    commentsCount: { serialize: false },
    postLikesCount: { serialize: false }
  }
});
