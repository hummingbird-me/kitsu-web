import * as Types from '../../../graphql/types';

import { DocumentNode } from 'graphql';
import { MediaFieldsFragmentDoc } from '../Media/mediaFields-gql';
export type MediaListFragment = {
  nodes?:
    | Array<
        | {
            id: string;
            type: string;
            slug: string;
            titles: { preferred: string };
          }
        | {
            id: string;
            type: string;
            slug: string;
            titles: { preferred: string };
          }
        | null
        | undefined
      >
    | null
    | undefined;
};

export const MediaListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MediaList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'MediaConnection' }
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
                  name: { kind: 'Name', value: 'MediaFields' }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode;
