import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import * as Types from '../../../graphql/types';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type QuickUpdateNoPostMutationVariables = Types.Exact<{
  libraryEntryInput: Types.LibraryEntryUpdateProgressByMediaInput;
}>;

export type QuickUpdateNoPostMutation = {
  libraryEntry: {
    updateProgressByMedia?: {
      libraryEntry?: {
        __typename: 'LibraryEntry';
        id: string;
        progress: number;
        nextUnit?:
          | { __typename: 'Chapter'; id: string; number: number }
          | { __typename: 'Episode'; id: string; number: number }
          | null;
      } | null;
      errors?: Array<
        | { message: string; code?: string | null; path?: Array<string> | null }
        | { message: string; code?: string | null; path?: Array<string> | null }
      > | null;
    } | null;
  };
};

export const QuickUpdateNoPostDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'QuickUpdateNoPost' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'libraryEntryInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'LibraryEntryUpdateProgressByMediaInput',
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'libraryEntry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'updateProgressByMedia' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'input' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'libraryEntryInput' },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'libraryEntry' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: '__typename' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nextUnit' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: '__typename' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'number' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'progress' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'errors' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'message' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'code' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'path' },
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

export function useQuickUpdateNoPostMutation() {
  return Urql.useMutation<
    QuickUpdateNoPostMutation,
    QuickUpdateNoPostMutationVariables
  >(QuickUpdateNoPostDocument);
}
