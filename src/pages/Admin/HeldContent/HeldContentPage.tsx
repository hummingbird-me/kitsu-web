import React, { useState } from 'react';

import Container from '@/components/utils/Container';
import { graphql, useQuery } from '@/graphql';

import HeldComment, { HeldCommentFragment } from './HeldComment';
import HeldMediaReaction, {
  HeldMediaReactionFragment,
} from './HeldMediaReaction';
import HeldPost, { HeldPostFragment } from './HeldPost';
import styles from './styles.module.css';

const HeldContentQuery = graphql(
  `
    query HeldContentQuery($first: Int!, $after: String) {
      heldForModeration(first: $first, after: $after) {
        edges {
          node {
            __typename
            ...HeldPostFragment
            ...HeldCommentFragment
            ...HeldMediaReactionFragment
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  [HeldPostFragment, HeldCommentFragment, HeldMediaReactionFragment],
);

export default function HeldContentPage() {
  const [after, setAfter] = useState('');

  const [{ data, fetching, error, stale }] = useQuery({
    query: HeldContentQuery,
    variables: { first: 50, after },
    suspense: false,
    requestPolicy: 'network-only',
  });

  const items = data?.heldForModeration;

  return (
    <Container className={styles.HeldItemsList}>
      {stale && <p>Stale data...</p>}

      {error && <p>Oh no... {error.message}</p>}

      {fetching && <p>Loading...</p>}

      {items?.edges && (
        <>
          {items.edges.map(({ node }) =>
            node.__typename === 'Post' ? (
              <HeldPost post={node} key={node.id} />
            ) : node.__typename === 'Comment' ? (
              <HeldComment comment={node} key={node.id} />
            ) : node.__typename === 'MediaReaction' ? (
              <HeldMediaReaction reaction={node} key={node.id} />
            ) : (
              <div key={node.id}>
                {node.__typename} {node.id}
              </div>
            ),
          )}

          {items.pageInfo.hasNextPage && (
            <button onClick={() => setAfter(items.pageInfo.endCursor)}>
              load more
            </button>
          )}
        </>
      )}
    </Container>
  );
}
