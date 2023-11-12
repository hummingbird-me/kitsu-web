import { DocumentNode } from 'graphql';

import { ImageFieldsFragmentDoc } from '../../../components/content/Image/imageFields-gql';
import * as Types from '../../../graphql/types';
import { MediaBannerFieldsFragmentDoc } from '../../Media/Banner/fields-gql';

export type AnimeBannerFieldsFragment = {
  status: Types.ReleaseStatusEnum;
  startDate?: Date | null;
  endDate?: Date | null;
  subtype: Types.AnimeSubtypeEnum;
  episodeCount?: number | null;
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

export const AnimeBannerFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'animeBannerFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Anime' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'mediaBannerFields' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subtype' } },
          { kind: 'Field', name: { kind: 'Name', value: 'episodeCount' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
