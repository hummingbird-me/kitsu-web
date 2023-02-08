import * as Types from '../../../graphql/types';

import { DocumentNode } from 'graphql';
export type MediaFields_Anime_Fragment = {
  id: string;
  type: string;
  slug: string;
  titles: { preferred: string };
};

export type MediaFields_Manga_Fragment = {
  id: string;
  type: string;
  slug: string;
  titles: { preferred: string };
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
        name: { kind: 'Name', value: 'Media' }
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
                { kind: 'Field', name: { kind: 'Name', value: 'preferred' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode;
