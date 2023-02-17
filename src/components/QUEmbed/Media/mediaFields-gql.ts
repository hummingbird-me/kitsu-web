import { DocumentNode } from 'graphql';

import * as Types from '../../../graphql/types';

export type MediaFields_Anime_Fragment = {
  id: string;
  type: string;
  slug: string;
  titles: { preferred: string };
  posterImage?: { original: { url: string } } | null;
  bannerImage?: { original: { url: string } } | null;
  myLibraryEntry?: { id: string; progress: number } | null;
};

export type MediaFields_Manga_Fragment = {
  id: string;
  type: string;
  slug: string;
  titles: { preferred: string };
  posterImage?: { original: { url: string } } | null;
  bannerImage?: { original: { url: string } } | null;
  myLibraryEntry?: { id: string; progress: number } | null;
};

export type MediaFieldsFragment =
  | MediaFields_Anime_Fragment
  | MediaFields_Manga_Fragment;

export const MediaFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MediaFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Media' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
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
            name: { kind: 'Name', value: 'posterImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'original' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                    ],
                  },
                },
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
                  kind: 'Field',
                  name: { kind: 'Name', value: 'original' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                    ],
                  },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'progress' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
