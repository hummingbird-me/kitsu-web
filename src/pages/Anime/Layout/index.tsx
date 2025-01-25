import React from 'react';

import { ImageFragment } from '@/components/content/Image';
import { graphql, readFragment, type FragmentOf } from '@/graphql/tada';
import PosterImage from 'app/components/content/PosterImage';
import LibraryBox, { LibraryBoxFragment } from 'app/pages/Media/LibraryBox';
import utilStyles from 'app/styles/utils.module.css';

import { AnimeBanner, AnimeBannerFragment } from '../Banner';
import styles from './styles.module.css';

export const AnimeLayoutFragment = graphql(
  `
    fragment AnimeLayoutFragment on Anime {
      posterImage {
        ...ImageFragment
      }
      ...AnimeBannerFragment
      ...LibraryBoxFragment
    }
  `,
  [AnimeBannerFragment, LibraryBoxFragment, ImageFragment],
);

export type AnimeLayoutProps = {
  media: FragmentOf<typeof AnimeLayoutFragment>;
  children: React.ReactNode;
};

export default function AnimeLayout(props: AnimeLayoutProps) {
  const media = readFragment(AnimeLayoutFragment, props.media);

  return (
    <div className={styles.page}>
      <AnimeBanner anime={media} />
      <div className={[utilStyles.container, styles.container].join(' ')}>
        <div className={styles.infoSidebar}>
          <PosterImage
            source={media.posterImage}
            className={styles.poster}
            height={250}
            width={180}
          />
          <LibraryBox media={media} />
        </div>
        {props.children}
      </div>
    </div>
  );
}
