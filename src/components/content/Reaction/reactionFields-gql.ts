import { DocumentNode } from 'graphql';

import * as Types from '../../../graphql/types';
import { ImageFieldsFragmentDoc } from '../Image/imageFields-gql';

export type ReactionFieldsFragment = {
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
};

export const ReactionFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'reactionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'MediaReaction' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hasLiked' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'likes' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '1' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'author' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'avatarImage' },
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
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'media' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'titles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'preferred' },
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
} as unknown as DocumentNode;
