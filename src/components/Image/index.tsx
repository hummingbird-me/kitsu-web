import React, {
  useState,
  useRef,
  useLayoutEffect,
  forwardRef,
  HTMLProps,
} from 'react';
import { BlurhashCanvas } from 'react-blurhash';

import { Image as GQImage, ImageView as GQImageView } from 'app/types/graphql';

import styles from './styles.module.css';

type ImageViewType = Pick<GQImageView, 'height' | 'width' | 'url'>;
export type ImageSource = Pick<GQImage, 'blurhash'> & {
  views: readonly ImageViewType[];
};

const viewsToSrcset = (views: readonly ImageViewType[]) =>
  views.map(({ width, url }) => `${url} ${width}w`).join(', ');

// TODO: find a better way to get the intrinsic size of the image
const Image = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & {
    height: number | string;
    width: number | string;
    source?: ImageSource;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none';
    blurhashSize?: number;
    className?: string;
    imageClassName?: string;
  }
>(function Image(
  {
    height,
    width,
    source,
    objectFit = 'cover',
    blurhashSize = 32,
    className,
    imageClassName,
    ...props
  },
  ref
) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [needsFadeIn, setNeedsFadeIn] = useState(false);

  useLayoutEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    } else {
      setNeedsFadeIn(true);
    }
  }, []);

  // Figure out the intrinsic size of the image and scale to max 32x32
  const intrinsicHeight = source?.views[0].height ?? 32;
  const intrinsicWidth = source?.views[0].width ?? 32;
  const aspectRatio = `${intrinsicWidth} / ${intrinsicHeight}`;
  const scale = Math.min(
    blurhashSize / intrinsicHeight,
    blurhashSize / intrinsicWidth
  );

  return (
    <div
      className={[styles.container, className].join(' ')}
      style={{ width, height, aspectRatio }}
      ref={ref}
      {...props}>
      {source?.blurhash ? (
        <BlurhashCanvas
          hash={source.blurhash}
          height={Math.ceil(intrinsicHeight * scale)}
          width={Math.ceil(intrinsicWidth * scale)}
          className={styles.blurhash}
          style={{ objectFit }}
        />
      ) : null}
      {source ? (
        <img
          ref={imageRef}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          height={height}
          width={width}
          className={[
            styles.image,
            imageClassName,
            needsFadeIn ? styles.fadeIn : null,
            isLoaded ? styles.loaded : null,
          ].join(' ')}
          style={{ objectFit }}
          srcSet={viewsToSrcset(source.views)}
        />
      ) : null}
    </div>
  );
});

export default Image;
