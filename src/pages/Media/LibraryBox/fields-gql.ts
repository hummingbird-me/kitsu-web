import { DocumentNode } from 'graphql';

import * as Types from '../../../graphql/types';

export type LibraryBoxFields_Anime_Fragment = {
  type: string;
  id: string;
  myLibraryEntry?: {
    id: string;
    status: Types.LibraryEntryStatusEnum;
    progress: number;
    rating?: number | null;
    reconsumeCount: number;
    reconsuming: boolean;
  } | null;
};

export type LibraryBoxFields_Manga_Fragment = {
  type: string;
  id: string;
  myLibraryEntry?: {
    id: string;
    status: Types.LibraryEntryStatusEnum;
    progress: number;
    rating?: number | null;
    reconsumeCount: number;
    reconsuming: boolean;
  } | null;
};

export type LibraryBoxFieldsFragment =
  | LibraryBoxFields_Anime_Fragment
  | LibraryBoxFields_Manga_Fragment;

export const LibraryBoxFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'libraryBoxFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Media' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'myLibraryEntry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'progress' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rating' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'reconsumeCount' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'reconsuming' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
