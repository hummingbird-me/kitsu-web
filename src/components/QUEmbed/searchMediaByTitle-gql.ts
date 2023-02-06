import * as Types from '../../graphql/types';

import { DocumentNode } from 'graphql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SearchMediaByTitleQueryVariables = Types.Exact<{
  title: Types.Scalars['String'];
  mediaType?: Types.InputMaybe<Types.MediaTypeEnum>;
}>;

export type SearchMediaByTitleQuery = {
  searchMediaByTitle: {
    nodes?:
      | Array<
          | { id: string; slug: string }
          | { id: string; slug: string }
          | null
          | undefined
        >
      | null
      | undefined;
  };
};

export const SearchMediaByTitleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SearchMediaByTitle' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'title' }
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'mediaType' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'MediaTypeEnum' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'searchMediaByTitle' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'title' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'title' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'mediaType' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'mediaType' }
                }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode;

export function useSearchMediaByTitleQuery(
  options: Omit<
    Urql.UseQueryArgs<SearchMediaByTitleQueryVariables>,
    'query'
  > = {}
) {
  return Urql.useQuery<SearchMediaByTitleQuery>({
    query: SearchMediaByTitleDocument,
    ...options
  });
}
