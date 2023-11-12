import { DocumentNode } from 'graphql';

import { ImageFieldsFragmentDoc } from '../../../components/content/Image/imageFields-gql';
import * as Types from '../../../graphql/types';
import { MediaBannerFieldsFragmentDoc } from '../../Media/Banner/fields-gql';
import { LibraryBoxFieldsFragmentDoc } from '../../Media/LibraryBox/fields-gql';
import { AnimeBannerFieldsFragmentDoc } from '../Banner/fields-gql';

export type AnimeLayoutFieldsFragment = {
  status: Types.ReleaseStatusEnum;
  startDate?: Date | null;
  endDate?: Date | null;
  subtype: Types.AnimeSubtypeEnum;
  episodeCount?: number | null;
  type: string;
  id: string;
  slug: string;
  myLibraryEntry?: {
    id: string;
    status: Types.LibraryEntryStatusEnum;
    progress: number;
    rating?: number | null;
    reconsumeCount: number;
    reconsuming: boolean;
  } | null;
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

export const AnimeLayoutFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'animeLayoutFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Anime' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'animeBannerFields' },
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'libraryBoxFields' },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
