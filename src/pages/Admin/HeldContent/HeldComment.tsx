import React from 'react';
import { BsEyeFill, BsTrashFill } from 'react-icons/bs';

import Avatar from '@/components/content/Avatar';
import Byline from '@/components/content/Byline';
import { ImageFragment } from '@/components/content/Image';
import Tag from '@/components/content/Tag';
import { FormattedRelativeTime } from '@/components/Formatted';
import Card from '@/components/surfaces/Card';
import { graphql, readFragment, type FragmentOf } from '@/graphql';

import MutationButton from './MutationButton';
import styles from './styles.module.css';

export const HeldCommentFragment = graphql(
  `
    fragment HeldCommentFragment on Comment {
      id
      content
      createdAt
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

const DeleteCommentMutation = graphql(
  `
    mutation DeleteCommentMutation($id: ID!) {
      comment {
        delete(input: { commentId: $id }) {
          result {
            ...HeldCommentFragment
          }
          errors {
            __typename
          }
        }
      }
    }
  `,
  [HeldCommentFragment],
);

const UnholdCommentMutation = graphql(
  `
    mutation UnholdCommentMutation($id: ID!) {
      comment {
        unhold(input: { commentId: $id }) {
          result {
            ...HeldCommentFragment
          }
          errors {
            __typename
          }
        }
      }
    }
  `,
  [HeldCommentFragment],
);

type HeldCommentProps = {
  comment: FragmentOf<typeof HeldCommentFragment>;
};

export default function HeldComment(props: HeldCommentProps) {
  const comment = readFragment(HeldCommentFragment, props.comment);

  return (
    <Card className={styles.HeldItemCard}>
      <Byline.Container className={styles.Byline}>
        <Byline.Avatar>
          <a
            href={`https://kitsu.app/users/${comment.author.slug ?? comment.author.id}`}>
            <Avatar size={48} source={comment.author.avatarImage} />
          </a>
        </Byline.Avatar>
        <Byline.Title>
          <a
            href={`https://kitsu.app/users/${comment.author.slug ?? comment.author.id}`}>
            {comment.author.name}
          </a>
        </Byline.Title>
        <Byline.Subtitle>
          <a href={`https://kitsu.app/comments/${comment.id}`}>
            <FormattedRelativeTime time={comment.createdAt} />
          </a>
        </Byline.Subtitle>
        <Byline.Right>
          <Tag color="blue">Comment</Tag>
        </Byline.Right>
      </Byline.Container>
      <div className={styles.Content}>{comment.content}</div>
      <MutationButton
        mutation={DeleteCommentMutation}
        variables={{ id: comment.id }}
        didError={(result) => {
          if (result.error || result.data?.comment.delete?.errors)
            return 'Failed';
        }}
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
        mutation={UnholdCommentMutation}
        variables={{ id: comment.id }}
        didError={(result) => {
          if (result.error || result.data?.comment.unhold?.errors)
            return 'Failed';
        }}
        size="medium"
        kind="solid"
        color="green"
        className={styles.UnholdButton}>
        <BsEyeFill /> Unhold
      </MutationButton>
    </Card>
  );
}
