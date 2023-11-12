import React from 'react';

import BannerImage from 'app/components/content/BannerImage';
import PosterImage from 'app/components/content/PosterImage';
import TabBar from 'app/components/navigation/TabBar';
import { HeaderSettings } from 'app/contexts/LayoutSettingsContext';
import utilStyles from 'app/styles/utils.module.css';
import { ImageSource } from 'app/types/ImageSource';

import { BannerFieldsFragment } from './fields-gql';
import styles from './styles.module.css';

function MediaBanner({
  media,
  children,
}: {
  media?: BannerFieldsFragment;
  children?: React.ReactNode;
}): JSX.Element | null {
  if (!media) return null;

  return (
    <>
      <HeaderSettings background="transparent" scrollBackground="opaque" />

      <BannerImage background={media?.bannerImage} className={styles.banner}>
        <div className={[utilStyles.container, styles.container].join(' ')}>
          {children}
        </div>
      </BannerImage>
    </>
  );
}

MediaBanner.Title = function MediaBannerTitle({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <h1 className={styles.title}>{children}</h1>;
};

MediaBanner.Subtitle = function MediaBannerSubtitle({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <span className={styles.subtitle}>{children}</span>;
};

MediaBanner.TabBar = function MediaBannerTabBar({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <TabBar className={styles.nav}>{children}</TabBar>;
};

MediaBanner.PosterImage = function MediaBannerPosterImage({
  source,
}: {
  source?: ImageSource;
}) {
  return <PosterImage source={source} className={styles.poster} width={180} />;
};

export default MediaBanner;
