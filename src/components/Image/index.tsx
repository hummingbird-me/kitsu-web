import React, { useState, forwardRef, HTMLProps } from 'react';
import { BlurhashCanvas } from 'react-blurhash';

import { Image as GQImage, ImageView as GQImageView } from 'app/types/graphql';

import styles from './styles.module.css';

type ImageViewType = Pick<GQImageView, 'height' | 'width' | 'url'>;
type ImageType = Pick<GQImage, 'blurhash'> & {
  views: ImageViewType[];
};

const viewsToSrcset = (views: readonly ImageViewType[]) =>
  views.map(({ width, url }) => `${url} ${width}w`).join(', ');

// TODO: find a better way to get the intrinsic size of the image
const Image = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & {
    height: number | string;
    width: number | string;
    source: ImageType;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none';
    blurhashSize?: number;
    className?: string;
  }
>(function (
  {
    height,
    width,
    source,
    objectFit = 'cover',
    blurhashSize = 32,
    className,
    ...props
  },
  ref
) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Figure out the intrinsic size of the image and scale to max 32x32
  const intrinsicHeight = source.views[0].height ?? 32;
  const intrinsicWidth = source.views[0].width ?? 32;
  const scale = Math.min(
    blurhashSize / intrinsicHeight,
    blurhashSize / intrinsicWidth
  );

  return source ? (
    <div
      className={[styles.container, className].join(' ')}
      style={{ height, width }}
      ref={ref}
      {...props}>
      {source.blurhash ? (
        <BlurhashCanvas
          hash={source.blurhash}
          height={Math.ceil(intrinsicHeight * scale)}
          width={Math.ceil(intrinsicWidth * scale)}
          className={styles.blurhash}
          style={{ objectFit }}
        />
      ) : null}
      <img
        onLoad={() => setIsLoaded(true)}
        height={height}
        width={width}
        className={[styles.image, isLoaded ? styles.loaded : null].join(' ')}
        style={{ objectFit }}
        srcSet={viewsToSrcset(source.views)}
      />
    </div>
  ) : null;
});

export default Image;
