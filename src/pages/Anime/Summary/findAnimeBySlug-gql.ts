import { DocumentNode } from 'graphql';
import * as Urql from 'urql';

import { ImageFieldsFragmentDoc } from '../../../components/content/Image/imageFields-gql';
import { ReactionFieldsFragmentDoc } from '../../../components/content/Reaction/reactionFields-gql';
import * as Types from '../../../graphql/types';
import { MediaBannerFieldsFragmentDoc } from '../../Media/Banner/fields-gql';
import { LibraryBoxFieldsFragmentDoc } from '../../Media/LibraryBox/fields-gql';
import { AnimeBannerFieldsFragmentDoc } from '../Banner/fields-gql';
import { AnimeLayoutFieldsFragmentDoc } from '../Layout/fields-gql';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FindAnimeBySlugQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
}>;

export type FindAnimeBySlugQuery = {
  findAnime?: {
    description: Record<string, string>;
    status: Types.ReleaseStatusEnum;
    startDate?: Date | null;
    endDate?: Date | null;
    subtype: Types.AnimeSubtypeEnum;
    episodeCount?: number | null;
    type: string;
    id: string;
    slug: string;
    categories: {
      nodes?: Array<{
        id: string;
        slug: string;
        title: Record<string, string>;
        root?: { id: string; slug: string } | null;
        parent?: { id: string; slug: string } | null;
      } | null> | null;
    };
    reactions: {
      nodes?: Array<{
        id: string;
        createdAt: Date;
        reaction: string;
        hasLiked: boolean;
        likes: { totalCount: number };
        author: {
          id: string;
          slug?: string | null;
          name: string;
          avatarImage?: {
            blurhash?: string | null;
            views: Array<{
              height?: number | null;
              width?: number | null;
              url: string;
            }>;
          } | null;
        };
        media:
          | { id: string; slug: string; titles: { preferred: string } }
          | { id: string; slug: string; titles: { preferred: string } };
      } | null> | null;
    };
    myLibraryEntry?: {
      id: string;
      status: Types.LibraryEntryStatusEnum;
      progress: number;
      rating?: number | null;
      reconsumeCount: number;
      reconsuming: boolean;
    } | null;
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
    titles: { preferred: string };
  } | null;
};

export const FindAnimeBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'findAnimeBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'findAnime' },
            name: { kind: 'Name', value: 'findAnimeBySlug' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'slug' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'animeLayoutFields' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'categories' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'first' },
                      value: { kind: 'IntValue', value: '50' },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: {
                        kind: 'ListValue',
                        values: [
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'on' },
                                value: { kind: 'EnumValue', value: 'ANCESTRY' },
                              },
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'direction' },
                                value: {
                                  kind: 'EnumValue',
                                  value: 'ASCENDING',
                                },
                              },
                            ],
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
                        name: { kind: 'Name', value: 'nodes' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'slug' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'root' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'slug' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'parent' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'slug' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'reactions' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: {
                        kind: 'ListValue',
                        values: [
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'on' },
                                value: {
                                  kind: 'EnumValue',
                                  value: 'UP_VOTES_COUNT',
                                },
                              },
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'direction' },
                                value: {
                                  kind: 'EnumValue',
                                  value: 'DESCENDING',
                                },
                              },
                            ],
                          },
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'on' },
                                value: {
                                  kind: 'EnumValue',
                                  value: 'CREATED_AT',
                                },
                              },
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'direction' },
                                value: {
                                  kind: 'EnumValue',
                                  value: 'DESCENDING',
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'first' },
                      value: { kind: 'IntValue', value: '6' },
                    },
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
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'reactionFields' },
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
    ...AnimeLayoutFieldsFragmentDoc.definitions,
    ...AnimeBannerFieldsFragmentDoc.definitions,
    ...MediaBannerFieldsFragmentDoc.definitions,
    ...ImageFieldsFragmentDoc.definitions,
    ...LibraryBoxFieldsFragmentDoc.definitions,
    ...ReactionFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode;

export function useFindAnimeBySlugQuery(
  options: Omit<Urql.UseQueryArgs<FindAnimeBySlugQueryVariables>, 'query'>,
) {
  return Urql.useQuery<FindAnimeBySlugQuery, FindAnimeBySlugQueryVariables>({
    query: FindAnimeBySlugDocument,
    ...options,
  });
}
