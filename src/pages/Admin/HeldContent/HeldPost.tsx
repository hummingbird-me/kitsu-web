import React, { useState } from 'react';
import { BsEyeFill, BsTrashFill } from 'react-icons/bs';

import Avatar from '@/components/content/Avatar';
import Byline from '@/components/content/Byline';
import { ImageFragment } from '@/components/content/Image';
import Tag from '@/components/content/Tag';
import { FormattedRelativeTime } from '@/components/Formatted';
import Card from '@/components/surfaces/Card';
import { graphql, readFragment, type FragmentOf } from '@/graphql';

import ModerationScoreTag from './ModerationScoreTag';
import MutationButton from './MutationButton';
import styles from './styles.module.css';

export const HeldPostFragment = graphql(
  `
    fragment HeldPostFragment on Post {
      id
      content
      createdAt
      heldReason
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

const DeletePostMutation = graphql(
  `
    mutation DeletePostMutation($id: ID!) {
      post {
        delete(input: { postId: $id }) {
          result {
            ...HeldPostFragment
          }
          errors {
            __typename
          }
        }
      }
    }
  `,
  [HeldPostFragment],
);

const UnholdPostMutation = graphql(
  `
    mutation UnholdPostMutation($id: ID!) {
      post {
        unhold(input: { id: $id }) {
          result {
            ...HeldPostFragment
          }
          errors {
            __typename
          }
        }
      }
    }
  `,
  [HeldPostFragment],
);

type HeldPostProps = {
  post: FragmentOf<typeof HeldPostFragment>;
};

export default function HeldPost(props: HeldPostProps) {
  const post = readFragment(HeldPostFragment, props.post);
  const [success, setSuccess] = useState(false);

  return (
    <Card
      className={[styles.HeldItemCard, success ? styles.Success : null].join(
        ' ',
      )}>
      {' '}
      <Byline.Container className={styles.Byline}>
        <Byline.Avatar>
          <a
            href={`https://kitsu.app/users/${post.author.slug ?? post.author.id}`}>
            <Avatar size={48} source={post.author.avatarImage} />
          </a>
        </Byline.Avatar>
        <Byline.Title>
          <a
            href={`https://kitsu.app/users/${post.author.slug ?? post.author.id}`}>
            {post.author.name}
          </a>
        </Byline.Title>
        <Byline.Subtitle>
          <a href={`https://kitsu.app/comments/${post.id}`}>
            <FormattedRelativeTime time={post.createdAt} />
          </a>
        </Byline.Subtitle>
        <Byline.Right className={styles.HeldItemTags}>
          <ModerationScoreTag
            moderationScores={post.moderationScores as Record<string, number>}
          />
          <Tag color="yellow">Post</Tag>
        </Byline.Right>
      </Byline.Container>
      <div className={styles.Content}>{post.content}</div>
      <MutationButton
        mutation={DeletePostMutation}
        variables={{ id: post.id }}
        didError={(result) => {
          if (result.error || result.data?.post.delete?.errors?.length)
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
        mutation={UnholdPostMutation}
        variables={{ id: post.id }}
        didError={(result) => {
          if (result.error || result.data?.post.unhold?.errors?.length)
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
