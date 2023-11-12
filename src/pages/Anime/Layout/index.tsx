import React from 'react';

import Image from 'app/components/content/Image';
import LibraryBox from 'app/pages/Media/LibraryBox';
import utilStyles from 'app/styles/utils.module.css';

import { AnimeBanner } from '../Banner';
import { AnimeLayoutFieldsFragment } from './fields-gql';
import styles from './styles.module.css';

export default function AnimeLayout({
  media,
  children,
}: {
  media: AnimeLayoutFieldsFragment;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className={styles.page}>
      <AnimeBanner anime={media} />
      <div className={[utilStyles.container, styles.container].join(' ')}>
        <div className={styles.infoSidebar}>
          <Image
            source={media.posterImage}
            className={styles.poster}
            height={250}
            width={180}
          />
          <LibraryBox media={media} />
        </div>
        {children}
      </div>
    </div>
  );
}
