import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import * as Types from '../../graphql/types';
import { ImageFieldsFragmentDoc } from '../content/Image/imageFields-gql';
import { MediaFieldsFragmentDoc } from './Media/mediaFields-gql';
import { MediaListConnectionFragmentDoc } from './MediaList/mediaListConnection-gql';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SearchMediaByTitleQueryVariables = Types.Exact<{
  title: Types.Scalars['String'];
  mediaType?: Types.InputMaybe<Types.MediaTypeEnum>;
}>;

export type SearchMediaByTitleQuery = {
  searchMediaByTitle: {
    nodes?: Array<
      | {
          id: string;
          type: string;
          slug: string;
          description: Record<string, string>;
          titles: { preferred: string };
          posterImage?: {
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
          myLibraryEntry?: { id: string; progress: number } | null;
        }
      | {
          id: string;
          type: string;
          slug: string;
          description: Record<string, string>;
          titles: { preferred: string };
          posterImage?: {
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
          myLibraryEntry?: { id: string; progress: number } | null;
        }
      | null
    > | null;
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
            name: { kind: 'Name', value: 'title' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'mediaType' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'MediaTypeEnum' },
          },
        },
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
                  name: { kind: 'Name', value: 'title' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'mediaType' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'mediaType' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '10' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'MediaListConnection' },
                },
              ],
            },
          },
        ],
      },
    },
    ...MediaListConnectionFragmentDoc.definitions,
    ...MediaFieldsFragmentDoc.definitions,
    ...ImageFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode;

export function useSearchMediaByTitleQuery(
  options: Omit<Urql.UseQueryArgs<SearchMediaByTitleQueryVariables>, 'query'>
) {
  return Urql.useQuery<
    SearchMediaByTitleQuery,
    SearchMediaByTitleQueryVariables
  >({ query: SearchMediaByTitleDocument, ...options });
}
