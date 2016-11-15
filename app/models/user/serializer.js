import ApplicationSerializer from 'client/models/application/serializer';

export default ApplicationSerializer.extend({
  attrs: {
    commentsCount: { serialize: false },
    favoritesCount: { serialize: false },
    followingCount: { serialize: false },
    followersCount: { serialize: false },
    likesGivenCount: { serialize: false },
    postsCount: { serialize: false },
    waifuDirtyHack: { serialize: false }
  }
});
