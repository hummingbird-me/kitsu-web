import { OptimisticMutationResolver } from '@urql/exchange-graphcache';

import { MediaReactionLikeInput } from 'app/graphql/types';

const like: OptimisticMutationResolver = (
  { input }: { input: MediaReactionLikeInput },
  cache,
) => ({
  __typename: 'MediaReactionLikePayload',
  result: () => ({
    __typename: 'MediaReaction',
    id: input.mediaReactionId,
    hasLiked: true,
    likes: () => {
      const likes = cache.resolve(
        { id: input.mediaReactionId, __typename: 'MediaReaction' },
        'likes',
        { first: 1 },
      ) as string;
      const totalCount = (cache.resolve(likes, 'totalCount') ?? 0) as number;
      return {
        __typename: 'ProfileConnection',
        totalCount: (totalCount ?? 0) + 1,
      };
    },
  }),
});

export default like;
