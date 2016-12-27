import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    commentsCount: { serialize: false },
    favoritesCount: { serialize: false },
    feedCompleted: { serialize: false },
    followingCount: { serialize: false },
    followersCount: { serialize: false },
    likesGivenCount: { serialize: false },
    postsCount: { serialize: false },
    profileCompleted: { serialize: false },
    ratingsCount: { serialize: false },
    waifuDirtyHack: { serialize: false }
  }
});
