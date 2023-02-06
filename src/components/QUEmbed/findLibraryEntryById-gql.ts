import * as Types from '../../graphql/types';

import { DocumentNode } from 'graphql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FindLibraryEntryByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type FindLibraryEntryByIdQuery = {
  findLibraryEntryById?:
    | {
        id: string;
        media: { id: string; slug: string } | { id: string; slug: string };
      }
    | null
    | undefined;
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
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
          }
        }
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
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'media' },
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

export function useFindLibraryEntryByIdQuery(
  options: Omit<
    Urql.UseQueryArgs<FindLibraryEntryByIdQueryVariables>,
    'query'
  > = {}
) {
  return Urql.useQuery<FindLibraryEntryByIdQuery>({
    query: FindLibraryEntryByIdDocument,
    ...options
  });
}
