import { initGraphQLTada } from 'gql.tada';

import type { Scalars } from '@/graphql/scalars';
import type { introspection } from '@/types/graphql-env';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: Scalars;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
