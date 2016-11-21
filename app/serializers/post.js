import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    commentsCount: { serialize: false },
    postLikesCount: { serialize: false },
    createdAt: { serialize: false }
  }
});
