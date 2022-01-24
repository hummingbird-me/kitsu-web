import * as Types from '../../graphql/types';

import { DocumentNode } from 'graphql';
export type CategoryTagFieldsFragment = {
  slug: string;
  title: Record<string, string>;
  root?: { slug: string } | null | undefined;
};

export const CategoryTagFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'categoryTagFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Category' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'root' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
