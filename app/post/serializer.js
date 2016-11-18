import ApplicationSerializer from 'client/application/serializer';

export default ApplicationSerializer.extend({
  attrs: {
    commentsCount: { serialize: false },
    postLikesCount: { serialize: false }
  }
});
