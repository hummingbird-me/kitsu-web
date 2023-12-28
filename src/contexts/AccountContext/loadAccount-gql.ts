import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import { ImageFieldsFragmentDoc } from '../../components/content/Image/imageFields-gql';
import * as Types from '../../graphql/types';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LoadAccountQueryVariables = Types.Exact<{ [key: string]: never }>;

export type LoadAccountQuery = {
  currentAccount?: {
    id: string;
    country?: string | null;
    language?: string | null;
    ratingSystem: Types.RatingSystemEnum;
    sfwFilter?: boolean | null;
    sitePermissions: Array<Types.SitePermissionEnum>;
    timeZone?: string | null;
    enabledFeatures: Array<string>;
    profile: {
      id: string;
      slug?: string | null;
      name: string;
      avatarImage?: {
        blurhash?: string | null;
        views: Array<{
          height?: number | null;
          width?: number | null;
          url: string;
        }>;
      } | null;
      bannerImage?: {
        blurhash?: string | null;
        views: Array<{
          height?: number | null;
          width?: number | null;
          url: string;
        }>;
      } | null;
    };
  } | null;
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
  options?: Omit<Urql.UseQueryArgs<LoadAccountQueryVariables>, 'query'>,
) {
  return Urql.useQuery<LoadAccountQuery, LoadAccountQueryVariables>({
    query: LoadAccountDocument,
    ...options,
  });
}
