import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    contentFormatted: { serialize: false },
    commentsCount: { serialize: false },
    postLikesCount: { serialize: false },
    topLevelCommentsCount: { serialize: false },
    createdAt: { serialize: false },
    updatedAt: { serialize: false }
  }
});
