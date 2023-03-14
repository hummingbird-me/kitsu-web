import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import * as Types from '../../graphql/types';
import { ImageFieldsFragmentDoc } from '../content/Image/imageFields-gql';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FindMediaByIdAndTypeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  mediaType: Types.MediaTypeEnum;
}>;

export type FindMediaByIdAndTypeQuery = {
  findMediaByIdAndType?:
    | {
        __typename: 'Anime';
        id: string;
        slug: string;
        type: string;
        sfw: boolean;
        titles: { preferred: string };
        bannerImage?: {
          blurhash?: string | null;
          views: Array<{
            height?: number | null;
            width?: number | null;
            url: string;
          }>;
        } | null;
        posterImage?: {
          blurhash?: string | null;
          views: Array<{
            height?: number | null;
            width?: number | null;
            url: string;
          }>;
        } | null;
        myLibraryEntry?: {
          __typename: 'LibraryEntry';
          id: string;
          progress: number;
          nextUnit?:
            | { __typename: 'Chapter'; id: string; number: number }
            | { __typename: 'Episode'; id: string; number: number }
            | null;
          lastUnit?:
            | { __typename: 'Chapter'; id: string; number: number }
            | { __typename: 'Episode'; id: string; number: number }
            | null;
        } | null;
      }
    | {
        __typename: 'Manga';
        id: string;
        slug: string;
        type: string;
        sfw: boolean;
        titles: { preferred: string };
        bannerImage?: {
          blurhash?: string | null;
          views: Array<{
            height?: number | null;
            width?: number | null;
            url: string;
          }>;
        } | null;
        posterImage?: {
          blurhash?: string | null;
          views: Array<{
            height?: number | null;
            width?: number | null;
            url: string;
          }>;
        } | null;
        myLibraryEntry?: {
          __typename: 'LibraryEntry';
          id: string;
          progress: number;
          nextUnit?:
            | { __typename: 'Chapter'; id: string; number: number }
            | { __typename: 'Episode'; id: string; number: number }
            | null;
          lastUnit?:
            | { __typename: 'Chapter'; id: string; number: number }
            | { __typename: 'Episode'; id: string; number: number }
            | null;
        } | null;
      }
    | null;
};

export type MediaData_Anime_Fragment = {
  __typename: 'Anime';
  id: string;
  slug: string;
  type: string;
  sfw: boolean;
  titles: { preferred: string };
  bannerImage?: {
    blurhash?: string | null;
    views: Array<{
      height?: number | null;
      width?: number | null;
      url: string;
    }>;
  } | null;
  posterImage?: {
    blurhash?: string | null;
    views: Array<{
      height?: number | null;
      width?: number | null;
      url: string;
    }>;
  } | null;
  myLibraryEntry?: {
    __typename: 'LibraryEntry';
    id: string;
    progress: number;
    nextUnit?:
      | { __typename: 'Chapter'; id: string; number: number }
      | { __typename: 'Episode'; id: string; number: number }
      | null;
    lastUnit?:
      | { __typename: 'Chapter'; id: string; number: number }
      | { __typename: 'Episode'; id: string; number: number }
      | null;
  } | null;
};

export type MediaData_Manga_Fragment = {
  __typename: 'Manga';
  id: string;
  slug: string;
  type: string;
  sfw: boolean;
  titles: { preferred: string };
  bannerImage?: {
    blurhash?: string | null;
    views: Array<{
      height?: number | null;
      width?: number | null;
      url: string;
    }>;
  } | null;
  posterImage?: {
    blurhash?: string | null;
    views: Array<{
      height?: number | null;
      width?: number | null;
      url: string;
    }>;
  } | null;
  myLibraryEntry?: {
    __typename: 'LibraryEntry';
    id: string;
    progress: number;
    nextUnit?:
      | { __typename: 'Chapter'; id: string; number: number }
      | { __typename: 'Episode'; id: string; number: number }
      | null;
    lastUnit?:
      | { __typename: 'Chapter'; id: string; number: number }
      | { __typename: 'Episode'; id: string; number: number }
      | null;
  } | null;
};

export type MediaDataFragment =
  | MediaData_Anime_Fragment
  | MediaData_Manga_Fragment;

export const MediaDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MediaData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Media' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sfw' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'titles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'preferred' } },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'posterImage' },
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
            name: { kind: 'Name', value: 'myLibraryEntry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastUnit' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: '__typename' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'progress' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const FindMediaByIdAndTypeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FindMediaByIdAndType' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'mediaType' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'MediaTypeEnum' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findMediaByIdAndType' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
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
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'MediaData' },
                },
              ],
            },
          },
        ],
      },
    },
    ...MediaDataFragmentDoc.definitions,
    ...ImageFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode;

export function useFindMediaByIdAndTypeQuery(
  options: Omit<Urql.UseQueryArgs<FindMediaByIdAndTypeQueryVariables>, 'query'>
) {
  return Urql.useQuery<
    FindMediaByIdAndTypeQuery,
    FindMediaByIdAndTypeQueryVariables
  >({ query: FindMediaByIdAndTypeDocument, ...options });
}
