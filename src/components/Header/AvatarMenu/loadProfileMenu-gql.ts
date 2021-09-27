import * as Types from '../../../types/graphql';

import { DocumentNode } from 'graphql';
import { ImageFieldsFragmentDoc } from '../../../fragments/imageFields-gql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  options: Omit<Urql.UseQueryArgs<LoadProfileMenuQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<LoadProfileMenuQuery>({
    query: LoadProfileMenuDocument,
    ...options,
  });
}
