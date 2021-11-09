import * as Types from '../../graphql/types';

import { DocumentNode } from 'graphql';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LoadAccountSettingsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LoadAccountSettingsQuery = {
  currentAccount?:
    | {
        id: string;
        country?: string | null | undefined;
        language?: string | null | undefined;
        titleLanguagePreference?:
          | Types.TitleLanguagePreferenceEnum
          | null
          | undefined;
        ratingSystem: Types.RatingSystemEnum;
        sfwFilter?: boolean | null | undefined;
        sitePermissions: Array<Types.SitePermissionEnum>;
        timeZone?: string | null | undefined;
        enabledFeatures: Array<string>;
      }
    | null
    | undefined;
};

export const LoadAccountSettingsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'loadAccountSettings' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                { kind: 'Field', name: { kind: 'Name', value: 'language' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'titleLanguagePreference' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'ratingSystem' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'sfwFilter' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sitePermissions' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'timeZone' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enabledFeatures' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

export function useLoadAccountSettingsQuery(
  options: Omit<
    Urql.UseQueryArgs<LoadAccountSettingsQueryVariables>,
    'query'
  > = {}
) {
  return Urql.useQuery<LoadAccountSettingsQuery>({
    query: LoadAccountSettingsDocument,
    ...options,
  });
}
