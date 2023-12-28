import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import * as Types from '../../../graphql/types';
import { ImageFieldsFragmentDoc } from '../../content/Image/imageFields-gql';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LoadProfileMenuQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LoadProfileMenuQuery = {
  currentAccount?: {
    id: string;
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

export const LoadProfileMenuDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'loadProfileMenu' },
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
              ],
            },
          },
        ],
      },
    },
    ...ImageFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode;

export function useLoadProfileMenuQuery(
  options?: Omit<Urql.UseQueryArgs<LoadProfileMenuQueryVariables>, 'query'>,
) {
  return Urql.useQuery<LoadProfileMenuQuery, LoadProfileMenuQueryVariables>({
    query: LoadProfileMenuDocument,
    ...options,
  });
}
