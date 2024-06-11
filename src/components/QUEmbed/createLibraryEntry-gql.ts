import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import * as Types from '../../graphql/types';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateLibraryEntryMutationVariables = Types.Exact<{
  input: Types.LibraryEntryCreateInput;
}>;

export type CreateLibraryEntryMutation = {
  libraryEntry: {
    create?: {
      libraryEntry?: { id: string } | null;
      errors?: Array<
        | {
            __typename: 'GenericError';
            code?: string | null;
            path?: Array<string> | null;
            message: string;
          }
        | {
            __typename: 'ValidationError';
            code?: string | null;
            path?: Array<string> | null;
            message: string;
          }
      > | null;
    } | null;
  };
};

export const CreateLibraryEntryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateLibraryEntry' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'LibraryEntryCreateInput' },
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
                  name: { kind: 'Name', value: 'create' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'input' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
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
                              name: { kind: 'Name', value: 'id' },
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
                              name: { kind: 'Name', value: '__typename' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'code' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'path' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'message' },
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

export function useCreateLibraryEntryMutation() {
  return Urql.useMutation<
    CreateLibraryEntryMutation,
    CreateLibraryEntryMutationVariables
  >(CreateLibraryEntryDocument);
}
