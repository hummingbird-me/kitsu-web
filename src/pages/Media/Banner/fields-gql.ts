import { DocumentNode } from 'graphql';

import { ImageFieldsFragmentDoc } from '../../../components/content/Image/imageFields-gql';
import * as Types from '../../../graphql/types';

export type MediaBannerFields_Anime_Fragment = {
  slug: string;
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
};

export type MediaBannerFields_Manga_Fragment = {
  slug: string;
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
};

export type MediaBannerFieldsFragment =
  | MediaBannerFields_Anime_Fragment
  | MediaBannerFields_Manga_Fragment;

export const MediaBannerFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'mediaBannerFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Media' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
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
            name: { kind: 'Name', value: 'titles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'preferred' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
