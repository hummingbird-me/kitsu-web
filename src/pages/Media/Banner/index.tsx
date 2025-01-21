import React, { type ComponentProps } from 'react';

import BannerImage from '@/components/content/BannerImage';
import { ImageFragment } from '@/components/content/Image';
import PosterImage from '@/components/content/PosterImage';
import TabBar from '@/components/navigation/TabBar';
import { HeaderSettings } from '@/contexts/LayoutSettingsContext';
import { graphql, readFragment, type FragmentOf } from '@/graphql/tada';
import utilStyles from '@/styles/utils.module.css';

import styles from './styles.module.css';

export const MediaBannerFragment = graphql(
  `
    fragment MediaBannerFragment on Media @_unmask {
      slug
      bannerImage {
        ...ImageFragment
      }
      posterImage {
        ...ImageFragment
      }
      titles {
        preferred
      }
    }
  `,
  [ImageFragment],
);

export type MediaBannerProps = {
  media?: FragmentOf<typeof MediaBannerFragment>;
  children?: React.ReactNode;
};

function MediaBanner(props: MediaBannerProps) | null {
  const media = readFragment(MediaBannerFragment, props.media);

  return (
    <>
      <HeaderSettings background="transparent" scrollBackground="opaque" />

      <BannerImage source={media?.bannerImage} className={styles.banner}>
        <div className={[utilStyles.container, styles.container].join(' ')}>
          {props.children}
        </div>
      </BannerImage>
    </>
  );
}

MediaBanner.Title = function MediaBannerTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className={styles.title}>{children}</h1>;
};

MediaBanner.Subtitle = function MediaBannerSubtitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span className={styles.subtitle}>{children}</span>;
};

MediaBanner.TabBar = function MediaBannerTabBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TabBar className={styles.nav}>{children}</TabBar>;
};

MediaBanner.PosterImage = function MediaBannerPosterImage({
  source,
}: Omit<ComponentProps<typeof PosterImage>, 'height' | 'width'>) {
  return <PosterImage source={source} className={styles.poster} width={180} />;
};

export default MediaBanner;
