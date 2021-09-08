import * as Types from '../../types/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type LoadAccountSettingsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LoadAccountSettingsQuery = {
  currentAccount?: Types.Maybe<{
    id: string;
    country?: Types.Maybe<string>;
    language?: Types.Maybe<string>;
    titleLanguagePreference?: Types.Maybe<Types.TitleLanguagePreferenceEnum>;
    ratingSystem: Types.RatingSystemEnum;
    sfwFilter?: Types.Maybe<boolean>;
    sitePermissions: Array<Types.SitePermissionEnum>;
    timeZone?: Types.Maybe<string>;
    enabledFeatures: Array<string>;
  }>;
};

export const LoadAccountSettingsDocument = gql`
  query loadAccountSettings {
    currentAccount {
      id
      country
      language
      titleLanguagePreference
      ratingSystem
      sfwFilter
      sitePermissions
      timeZone
      enabledFeatures
    }
  }
`;

/**
 * __useLoadAccountSettingsQuery__
 *
 * To run a query within a React component, call `useLoadAccountSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadAccountSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadAccountSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoadAccountSettingsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoadAccountSettingsQuery,
    LoadAccountSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    LoadAccountSettingsQuery,
    LoadAccountSettingsQueryVariables
  >(LoadAccountSettingsDocument, options);
}
export function useLoadAccountSettingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoadAccountSettingsQuery,
    LoadAccountSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoadAccountSettingsQuery,
    LoadAccountSettingsQueryVariables
  >(LoadAccountSettingsDocument, options);
}
export type LoadAccountSettingsQueryHookResult = ReturnType<
  typeof useLoadAccountSettingsQuery
>;
export type LoadAccountSettingsLazyQueryHookResult = ReturnType<
  typeof useLoadAccountSettingsLazyQuery
>;
export type LoadAccountSettingsQueryResult = Apollo.QueryResult<
  LoadAccountSettingsQuery,
  LoadAccountSettingsQueryVariables
>;
