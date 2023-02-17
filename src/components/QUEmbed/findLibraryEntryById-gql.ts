import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import * as Types from '../../graphql/types';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FindLibraryEntryByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type FindLibraryEntryByIdQuery = {
  findLibraryEntryById?: {
    id: string;
    progress: number;
    nextUnit?:
      | { titles: { preferred: string } }
      | { titles: { preferred: string } }
      | null;
    media:
      | {
          id: string;
          type: string;
          slug: string;
          titles: { preferred: string };
        }
      | {
          id: string;
          type: string;
          slug: string;
          titles: { preferred: string };
        };
  } | null;
};

export const FindLibraryEntryByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FindLibraryEntryById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findLibraryEntryById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nextUnit' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'titles' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'preferred' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'progress' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'media' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'titles' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'preferred' },
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
  ],
} as unknown as DocumentNode;

export function useFindLibraryEntryByIdQuery(
  options: Omit<Urql.UseQueryArgs<FindLibraryEntryByIdQueryVariables>, 'query'>
) {
  return Urql.useQuery<
    FindLibraryEntryByIdQuery,
    FindLibraryEntryByIdQueryVariables
  >({ query: FindLibraryEntryByIdDocument, ...options });
}
