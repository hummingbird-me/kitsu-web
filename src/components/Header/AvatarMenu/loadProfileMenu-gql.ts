import * as Types from '../../../types/graphql';

import { gql } from '@apollo/client';
import { ImageFieldsFragmentDoc } from '../../../fragments/imageFields-gql';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type LoadProfileMenuQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LoadProfileMenuQuery = {
  currentAccount?: Types.Maybe<{
    id: string;
    profile: {
      id: string;
      slug?: Types.Maybe<string>;
      name: string;
      avatarImage?: Types.Maybe<{
        blurhash?: Types.Maybe<string>;
        views: Array<{
          height?: Types.Maybe<number>;
          width?: Types.Maybe<number>;
          url: string;
        }>;
      }>;
      bannerImage?: Types.Maybe<{
        blurhash?: Types.Maybe<string>;
        views: Array<{
          height?: Types.Maybe<number>;
          width?: Types.Maybe<number>;
          url: string;
        }>;
      }>;
    };
  }>;
};

export const LoadProfileMenuDocument = gql`
  query loadProfileMenu {
    currentAccount {
      id
      profile {
        id
        slug
        name
        avatarImage {
          ...imageFields
        }
        bannerImage {
          ...imageFields
        }
      }
    }
  }
  ${ImageFieldsFragmentDoc}
`;

/**
 * __useLoadProfileMenuQuery__
 *
 * To run a query within a React component, call `useLoadProfileMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadProfileMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadProfileMenuQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoadProfileMenuQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoadProfileMenuQuery,
    LoadProfileMenuQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoadProfileMenuQuery, LoadProfileMenuQueryVariables>(
    LoadProfileMenuDocument,
    options
  );
}
export function useLoadProfileMenuLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoadProfileMenuQuery,
    LoadProfileMenuQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoadProfileMenuQuery,
    LoadProfileMenuQueryVariables
  >(LoadProfileMenuDocument, options);
}
export type LoadProfileMenuQueryHookResult = ReturnType<
  typeof useLoadProfileMenuQuery
>;
export type LoadProfileMenuLazyQueryHookResult = ReturnType<
  typeof useLoadProfileMenuLazyQuery
>;
export type LoadProfileMenuQueryResult = Apollo.QueryResult<
  LoadProfileMenuQuery,
  LoadProfileMenuQueryVariables
>;
