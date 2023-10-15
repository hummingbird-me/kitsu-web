import { OptimisticMutationResolver } from '@urql/exchange-graphcache';

import { MediaReactionUnlikeInput } from 'app/graphql/types';

const unlike: OptimisticMutationResolver = (
  { input }: { input: MediaReactionUnlikeInput },
  cache,
) => ({
  __typename: 'MediaReactionUnlikePayload',
  result: () => ({
    __typename: 'MediaReaction',
    id: input.mediaReactionId,
    hasLiked: false,
    likes: () => {
      const likes = cache.resolve(
        { id: input.mediaReactionId, __typename: 'MediaReaction' },
        'likes',
        { first: 1 },
      ) as string;
      const totalCount = (cache.resolve(likes, 'totalCount') ?? 0) as number;
      return {
        __typename: 'ProfileConnection',
        totalCount: (totalCount ?? 0) - 1,
      };
    },
  }),
});

export default unlike;
