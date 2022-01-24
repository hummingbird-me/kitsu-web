import * as Types from '../../graphql/types';

import { DocumentNode } from 'graphql';
import { CategoryTagFieldsFragmentDoc } from '../CategoryTag/categoryTagFields-gql';
export type CategoryListFields_Anime_Fragment = {
  categories: {
    nodes?:
      | Array<
          | {
              slug: string;
              title: Record<string, string>;
              root?: { slug: string } | null | undefined;
            }
          | null
          | undefined
        >
      | null
      | undefined;
  };
};

export type CategoryListFields_Manga_Fragment = {
  categories: {
    nodes?:
      | Array<
          | {
              slug: string;
              title: Record<string, string>;
              root?: { slug: string } | null | undefined;
            }
          | null
          | undefined
        >
      | null
      | undefined;
  };
};

export type CategoryListFieldsFragment =
  | CategoryListFields_Anime_Fragment
  | CategoryListFields_Manga_Fragment;

export const CategoryListFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'categoryListFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Media' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
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
                          value: { kind: 'EnumValue', value: 'ASCENDING' },
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
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'categoryTagFields' },
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
