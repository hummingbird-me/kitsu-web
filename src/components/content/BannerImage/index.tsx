import React from 'react';

import { source as defaultBanner } from 'app/assets/default_banner.png';
import Image, { ImageSource } from 'app/components/content/Image';

import styles from './styles.module.css';

type BannerImageProps = {
  background?: ImageSource | null;
  children?: React.ReactNode;
  className?: string;
};

export default function BannerImage({
  background,
  children,
  className,
}: BannerImageProps) {
  return (
    <div className={[styles.container, className].join(' ')}>
      <Image
        source={background ?? defaultBanner}
        height="100%"
        width="100%"
        className={styles.background}
      />
      <div className={styles.overlay}>{children}</div>
    </div>
  );
}
