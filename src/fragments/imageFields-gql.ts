import * as Types from '../types/graphql';

import { gql } from '@apollo/client';
export type ImageFieldsFragment = {
  blurhash?: Types.Maybe<string>;
  views: Array<{
    height?: Types.Maybe<number>;
    width?: Types.Maybe<number>;
    url: string;
  }>;
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
