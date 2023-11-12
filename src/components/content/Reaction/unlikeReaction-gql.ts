import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import * as Types from '../../../graphql/types';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UnlikeReactionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type UnlikeReactionMutation = {
  mediaReaction: {
    unlike?: {
      result?: {
        id: string;
        hasLiked: boolean;
        likes: { totalCount: number };
      } | null;
    } | null;
  };
};

export const UnlikeReactionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'unlikeReaction' },
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
            name: { kind: 'Name', value: 'mediaReaction' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'unlike' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'input' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'mediaReactionId' },
                            value: {
                              kind: 'Variable',
                              name: { kind: 'Name', value: 'id' },
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'result' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'hasLiked' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'likes' },
                              arguments: [
                                {
                                  kind: 'Argument',
                                  name: { kind: 'Name', value: 'first' },
                                  value: { kind: 'IntValue', value: '1' },
                                },
                              ],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totalCount' },
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
      },
    },
  ],
} as unknown as DocumentNode;

export function useUnlikeReactionMutation() {
  return Urql.useMutation<
    UnlikeReactionMutation,
    UnlikeReactionMutationVariables
  >(UnlikeReactionDocument);
}
