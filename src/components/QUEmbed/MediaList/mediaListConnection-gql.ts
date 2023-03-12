import { DocumentNode } from 'graphql';

import * as Types from '../../../graphql/types';
import { ImageFieldsFragmentDoc } from '../../content/Image/imageFields-gql';
import { MediaFieldsFragmentDoc } from '../Media/mediaFields-gql';

export type MediaListConnectionFragment = {
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

export const MediaListConnectionFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MediaListConnection' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'MediaConnection' },
      },
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
                  name: { kind: 'Name', value: 'MediaFields' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
