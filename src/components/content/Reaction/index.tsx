import React from 'react';
import { FaCaretUp } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';

import Avatar from 'app/components/content/Avatar';
import { Link } from 'app/components/content/Link';
import Button, {
  ButtonColor,
  ButtonKind,
} from 'app/components/controls/Button';
import { FormattedRelativeTime } from 'app/components/Formatted';
import Card from 'app/components/surfaces/Card';
import { paths } from 'app/pages/routes';

import { useLikeReactionMutation } from './likeReaction-gql';
import { ReactionFieldsFragment } from './reactionFields-gql';
import styles from './styles.module.css';
import { useUnlikeReactionMutation } from './unlikeReaction-gql';

export type ReactionCardProps = { reaction: ReactionFieldsFragment };

function ReactionLikeButton({
  hasLiked,
  likesCount,
  id,
}: {
  hasLiked: boolean;
  likesCount: number;
  id: string;
}): JSX.Element {
  const [, likeReaction] = useLikeReactionMutation();
  const [, unlikeReaction] = useUnlikeReactionMutation();

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

/**
 * Reaction cards are used to display a reaction posted by a user about a media. For authenticated
 * users, they display a clickable upvote button. For unauthenticated users, they display the upvote
 * button but it's disabled and non-clickable.
 *
 * Reaction cards are a simple grid layout, and scale smoothly with no breakpoints.
 */
export default function ReactionCard({
  reaction: {
    hasLiked,
    createdAt,
    id,
    reaction: content,
    likes: { totalCount: likesCount },
    author,
    media,
  },
}: ReactionCardProps): JSX.Element {
  return (
    <Card className={styles.container}>
      <ReactionLikeButton hasLiked={hasLiked} likesCount={likesCount} id={id} />
      <Avatar source={author.avatarImage} size={36} className={styles.avatar} />
      <div className={styles.mediaTitle}>{media.titles.preferred}</div>
      <div className={styles.byline}>
        <span className={styles.author}>
          <FormattedMessage
            defaultMessage="by <b>{author}</b>"
            values={{
              author: (
                <Link to={paths.profile(author)} className={styles.bylineLink}>
                  {author.name}
                </Link>
              ),
            }}
          />
        </span>
        <span className={styles.time}>
          <FormattedRelativeTime time={createdAt} strict />
        </span>
      </div>
      <div className={styles.content}>{content}</div>
    </Card>
  );
}
