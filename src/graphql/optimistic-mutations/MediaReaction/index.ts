import like from './like';
import unlike from './unlike';

const mediaReaction = () => ({
  __typename: 'MediaReactionMutations',
  like,
  unlike,
});

export default mediaReaction;
