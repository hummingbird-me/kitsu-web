import * as Types from '../../types/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type LoadFeatureFlagsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LoadFeatureFlagsQuery = {
  currentAccount?: Types.Maybe<{ id: string; enabledFeatures: Array<string> }>;
};

export const LoadFeatureFlagsDocument = gql`
  query loadFeatureFlags {
    currentAccount {
      id
      enabledFeatures
    }
  }
`;

/**
 * __useLoadFeatureFlagsQuery__
 *
 * To run a query within a React component, call `useLoadFeatureFlagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadFeatureFlagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadFeatureFlagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoadFeatureFlagsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoadFeatureFlagsQuery,
    LoadFeatureFlagsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoadFeatureFlagsQuery, LoadFeatureFlagsQueryVariables>(
    LoadFeatureFlagsDocument,
    options
  );
}
export function useLoadFeatureFlagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoadFeatureFlagsQuery,
    LoadFeatureFlagsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoadFeatureFlagsQuery,
    LoadFeatureFlagsQueryVariables
  >(LoadFeatureFlagsDocument, options);
}
export type LoadFeatureFlagsQueryHookResult = ReturnType<
  typeof useLoadFeatureFlagsQuery
>;
export type LoadFeatureFlagsLazyQueryHookResult = ReturnType<
  typeof useLoadFeatureFlagsLazyQuery
>;
export type LoadFeatureFlagsQueryResult = Apollo.QueryResult<
  LoadFeatureFlagsQuery,
  LoadFeatureFlagsQueryVariables
>;
