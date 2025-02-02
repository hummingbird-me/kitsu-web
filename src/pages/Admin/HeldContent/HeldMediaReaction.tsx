import React, { useState } from 'react';
import { BsEyeFill, BsTrashFill } from 'react-icons/bs';

import Avatar from '@/components/content/Avatar';
import Byline from '@/components/content/Byline';
import { ImageFragment } from '@/components/content/Image';
import Tag from '@/components/content/Tag';
import { FormattedRelativeTime } from '@/components/Formatted';
import Card from '@/components/surfaces/Card';
import { graphql, readFragment, type FragmentOf } from '@/graphql';
import ModerationScoreTag from '@/pages/Admin/HeldContent/ModerationScoreTag';

import MutationButton from './MutationButton';
import styles from './styles.module.css';

export const HeldMediaReactionFragment = graphql(
  `
    fragment HeldMediaReactionFragment on MediaReaction {
      id
      reaction
      createdAt
      moderationScores
      author {
        id
        slug
        name
        avatarImage {
          ...ImageFragment
        }
      }
    }
  `,
  [ImageFragment],
);

const DeleteMediaReactionMutation = graphql(
  `
    mutation DeleteMediaReactionMutation($id: ID!) {
      mediaReaction {
        delete(input: { mediaReactionId: $id }) {
          result {
            ...HeldMediaReactionFragment
          }
          errors {
            __typename
          }
        }
      }
    }
  `,
  [HeldMediaReactionFragment],
);

const UnholdMediaReactionMutation = graphql(
  `
    mutation UnholdMediaReactionMutation($id: ID!) {
      mediaReaction {
        unhold(input: { mediaReactionId: $id }) {
          result {
            ...HeldMediaReactionFragment
          }
          errors {
            __typename
          }
        }
      }
    }
  `,
  [HeldMediaReactionFragment],
);

type HeldMediaReactionProps = {
  reaction: FragmentOf<typeof HeldMediaReactionFragment>;
};

export default function HeldMediaReaction(props: HeldMediaReactionProps) {
  const reaction = readFragment(HeldMediaReactionFragment, props.reaction);
  const [success, setSuccess] = useState(false);

  return (
    <Card
      className={[styles.HeldItemCard, success ? styles.Success : null].join(
        ' ',
      )}>
      <Byline.Container className={styles.Byline}>
        <Byline.Avatar>
          <a
            href={`https://kitsu.app/users/${reaction.author.slug ?? reaction.author.id}`}>
            <Avatar size={48} source={reaction.author.avatarImage} />
          </a>
        </Byline.Avatar>
        <Byline.Title>
          <a
            href={`https://kitsu.app/users/${reaction.author.slug ?? reaction.author.id}`}>
            {reaction.author.name}
          </a>
        </Byline.Title>
        <Byline.Subtitle>
          <a href={`https://kitsu.app/media-reactions/${reaction.id}`}>
            <FormattedRelativeTime time={reaction.createdAt} />
          </a>
        </Byline.Subtitle>
        <Byline.Right className={styles.HeldItemTags}>
          <ModerationScoreTag
            moderationScores={
              reaction.moderationScores as Record<string, number>
            }
          />
          <Tag color="purple">Reaction</Tag>
        </Byline.Right>
      </Byline.Container>
      <div className={styles.Content}>{reaction.reaction}</div>
      <MutationButton
        mutation={DeleteMediaReactionMutation}
        variables={{ id: reaction.id }}
        didError={(result) => {
          if (result.error || result.data?.mediaReaction.delete?.errors?.length)
            return 'Failed';
        }}
        onSuccess={() => setSuccess(true)}
        size="medium"
        kind="solid"
        color="red"
        className={styles.DeleteButton}>
        <BsTrashFill /> Delete
      </MutationButton>
      {/*<Button
        size="medium"
        kind="solid"
        color="purple"
        disabled
        className={styles.BanButton}>
        <BsRadioactive />
        Nuke & Ban
      </Button>*/}
      <MutationButton
        mutation={UnholdMediaReactionMutation}
        variables={{ id: reaction.id }}
        didError={(result) => {
          if (result.error || result.data?.mediaReaction.unhold?.errors?.length)
            return 'Failed';
        }}
        onSuccess={() => setSuccess(true)}
        size="medium"
        kind="solid"
        color="green"
        className={styles.UnholdButton}>
        <BsEyeFill /> Unhold
      </MutationButton>
    </Card>
  );
}
