import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import * as Types from '../../../graphql/types';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FindAnimeSlugByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type FindAnimeSlugByIdQuery = {
  findAnimeById?: { slug: string } | null;
};

export const FindAnimeSlugByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'findAnimeSlugById' },
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
            name: { kind: 'Name', value: 'findAnimeById' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

export function useFindAnimeSlugByIdQuery(
  options: Omit<Urql.UseQueryArgs<FindAnimeSlugByIdQueryVariables>, 'query'>,
) {
  return Urql.useQuery<FindAnimeSlugByIdQuery, FindAnimeSlugByIdQueryVariables>(
    { query: FindAnimeSlugByIdDocument, ...options },
  );
}
