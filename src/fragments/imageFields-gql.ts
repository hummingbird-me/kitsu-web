import * as Types from '../types/graphql';

import { gql } from '@apollo/client';
export type ImageFieldsFragment = Pick<Types.Image, 'blurhash'> & {
  views: Array<Pick<Types.ImageView, 'height' | 'width' | 'url'>>;
};

export const ImageFieldsFragmentDoc = gql`
  fragment imageFields on Image {
    blurhash
    views {
      height
      width
      url
    }
  }
`;
