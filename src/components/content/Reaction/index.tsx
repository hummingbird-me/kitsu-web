import React from 'react';
import { FaCaretUp } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';
import { useQuery } from 'urql';

import Avatar from '@/components/content/Avatar';
import { ImageFragment } from '@/components/content/Image';
import { Link } from '@/components/content/Link';
import Button, { ButtonColor, ButtonKind } from '@/components/controls/Button';
import { FormattedRelativeTime } from '@/components/Formatted';
import Card from '@/components/surfaces/Card';
import { graphql, readFragment, type FragmentOf } from '@/graphql/tada';
import { paths } from '@/pages/routes';

import styles from './styles.module.css';

export const ReactionCardFragment = graphql(
  `
    fragment ReactionCardFragment on MediaReaction {
      id
      createdAt
      reaction
      hasLiked
      likes(first: 1) {
        totalCount
      }
      author {
        id
        slug
        name
        avatarImage {
          ...ImageFragment
        }
      }
      media {
        id
        slug
        titles {
          preferred
        }
      }
    }
  `,
  [ImageFragment],
);

const LikeCountFragment = graphql(`
  fragment LikeCountFragment on MediaReaction {
    id
    hasLiked
    likes(first: 1) {
      totalCount
    }
  }
`);

const LikeMutation = graphql(
  `
    mutation likeReaction($id: ID!) {
      mediaReaction {
        like(input: { mediaReactionId: $id }) {
          result {
            ...LikeCountFragment
          }
        }
      }
    }
  `,
  [LikeCountFragment],
);
const useLikeMutation = (id: string) =>
  useQuery({ query: LikeMutation, variables: { id }, pause: true });

const UnlikeMutation = graphql(
  `
    mutation unlikeReaction($id: ID!) {
      mediaReaction {
        unlike(input: { mediaReactionId: $id }) {
          result {
            ...LikeCountFragment
          }
        }
      }
    }
  `,
  [LikeCountFragment],
);
const useUnlikeMutation = (id: string) =>
  useQuery({ query: UnlikeMutation, variables: { id }, pause: true });

function ReactionLikeButton({
  hasLiked,
  likesCount,
  id,
}: {
  hasLiked: boolean;
  likesCount: number;
  id: string;
}): JSX.Element {
  const [, likeReaction] = useLikeMutation(id);
  const [, unlikeReaction] = useUnlikeMutation(id);

  return (
    <Button
      kind={ButtonKind.OUTLINE}
      color={hasLiked ? ButtonColor.KITSU_PURPLE : ButtonColor.GREY}
      onClick={() => (hasLiked ? unlikeReaction({ id }) : likeReaction({ id }))}
      className={styles.updoot}>
      <FaCaretUp size="1.3em" /> {likesCount}
    </Button>
  );
}

export type ReactionCardProps = {
  reaction: FragmentOf<typeof ReactionCardFragment>;
};

/**
 * Reaction cards are used to display a reaction posted by a user about a media. For authenticated
 * users, they display a clickable upvote button. For unauthenticated users, they display the upvote
 * button, but it's disabled and non-clickable.
 *
 * Reaction cards are a simple grid layout, and scale smoothly with no breakpoints.
 */
export default function ReactionCard(props: ReactionCardProps): JSX.Element {
  const reaction = readFragment(ReactionCardFragment, props.reaction);

  return (
    <Card className={styles.container}>
      <ReactionLikeButton
        hasLiked={reaction.hasLiked}
        likesCount={reaction.likes.totalCount}
        id={reaction.id}
      />
      <Avatar
        source={reaction.author.avatarImage}
        size={36}
        className={styles.avatar}
      />
      <div className={styles.mediaTitle}>{reaction.media.titles.preferred}</div>
      <div className={styles.byline}>
        <span className={styles.author}>
          <FormattedMessage
            defaultMessage="by <b>{author}</b>"
            values={{
              author: (
                <Link
                  to={paths.profile(reaction.author)}
                  className={styles.bylineLink}>
                  {reaction.author.name}
                </Link>
              ),
            }}
          />
        </span>
        <span className={styles.time}>
          <FormattedRelativeTime time={reaction.createdAt} strict />
        </span>
      </div>
      <div className={styles.content}>{reaction.reaction}</div>
    </Card>
  );
}
