import * as Types from '../../graphql/types';

import { DocumentNode } from 'graphql';
import { ImageFieldsFragmentDoc } from '../../components/Image/imageFields-gql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LoadAccountQueryVariables = Types.Exact<{ [key: string]: never }>;

export type LoadAccountQuery = {
  currentAccount?:
    | {
        id: string;
        country?: string | null | undefined;
        language?: string | null | undefined;
        ratingSystem: Types.RatingSystemEnum;
        sfwFilter?: boolean | null | undefined;
        sitePermissions: Array<Types.SitePermissionEnum>;
        timeZone?: string | null | undefined;
        enabledFeatures: Array<string>;
        profile: {
          id: string;
          slug?: string | null | undefined;
          name: string;
          avatarImage?:
            | {
                blurhash?: string | null | undefined;
                views: Array<{
                  height?: number | null | undefined;
                  width?: number | null | undefined;
                  url: string;
                }>;
              }
            | null
            | undefined;
          bannerImage?:
            | {
                blurhash?: string | null | undefined;
                views: Array<{
                  height?: number | null | undefined;
                  width?: number | null | undefined;
                  url: string;
                }>;
              }
            | null
            | undefined;
        };
      }
    | null
    | undefined;
};

export const LoadAccountDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'loadAccount' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'profile' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avatarImage' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'imageFields' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'bannerImage' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'imageFields' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                { kind: 'Field', name: { kind: 'Name', value: 'language' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'ratingSystem' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'sfwFilter' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sitePermissions' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'timeZone' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enabledFeatures' },
                },
              ],
            },
          },
        ],
      },
    },
    ...ImageFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode;

export function useLoadAccountQuery(
  options: Omit<Urql.UseQueryArgs<LoadAccountQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<LoadAccountQuery>({
    query: LoadAccountDocument,
    ...options,
  });
}
