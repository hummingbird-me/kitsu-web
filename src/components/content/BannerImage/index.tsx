import React from 'react';

import { source as defaultBanner } from 'app/assets/default_banner.jpg?imageSource';
import Image from 'app/components/content/Image';
import { ImageSource } from 'app/types/ImageSource';

import styles from './styles.module.css';

export type BannerImageProps = {
  /** The background image to display. Defaults to a default banner image. */
  background?: ImageSource | null;
  /** Overrides the loading state of the image. Usually unnecessary. */
  isLoaded?: boolean;
  children?: React.ReactNode;
  /** Classes which get applied to the container */
  className?: string;
};

/**
 * Y'know those funny decorative images that show up at the top of a page? Those are banner images.
 * This component makes them easy and consistent across all pages, with a thin wrapper around the
 * Image component.
 *
 * Any children passed to this component will be rendered as an overlay, with a darkened background.
 * This is useful for displaying things like avatars, tab bars, etc.
 */
export default function BannerImage({
  background,
  children,
  isLoaded,
  className,
}: BannerImageProps) {
  return (
    <div className={[styles.container, className].join(' ')}>
      <Image
        source={background ?? defaultBanner}
        height="100%"
        width="100%"
        isLoaded={isLoaded}
        className={styles.background}
      />
      <div
        className={[styles.overlay, children ? styles.hasChildren : ''].join(
          ' ',
        )}>
        {children}
      </div>
    </div>
  );
}
