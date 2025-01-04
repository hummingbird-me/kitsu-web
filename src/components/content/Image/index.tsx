import React, {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLProps,
} from 'react';
import { BlurhashCanvas } from 'react-blurhash';

import {
  graphql,
  readFragment,
  type FragmentOf,
  type ResultOf,
} from '@/graphql/tada';

import styles from './styles.module.css';

export const ImageFragment = graphql(`
  fragment ImageFragment on Image {
    blurhash
    views {
      height
      width
      url
    }
  }
`);

// Max dimension of the blurhash canvas
const BLURHASH_SIZE = 32;

export type ImageSource =
  | FragmentOf<typeof ImageFragment>
  | ResultOf<typeof ImageFragment>;

export type ImageProps = {
  /** The alt text for the image */
  alt?: string;
  /** Override whether the image is considered loaded */
  isLoaded?: boolean;
  /** The source of the image **/
  source: ImageSource;
  /** How the image should be resized to fit its container. */
  objectFit?: 'contain' | 'cover' | 'fill';
} & HTMLProps<HTMLDivElement>;

const viewsToSrcset = (
  views: readonly {
    height?: number | null;
    width?: number | null;
    url: string;
  }[],
) =>
  views
    .filter(({ width }) => width)
    .map(({ width, url }) => `${url} ${width}w`)
    .join(', ');

/**
 * The Image component takes in the API's representation of an image and displays it. It handles:
 *
 * - Displaying a blurhash until the image has finished loading
 * - Generating a srcset with all the sizes and formats of the image
 * - Detecting if the image is loaded from cache
 * - Fading in the image when it finishes loading, unless it's loaded from browser cache
 * - Enabling lazy loading on the image
 */
const Image = forwardRef<HTMLDivElement, ImageProps>(function Image(
  {
    height,
    width,
    source: sourceProp,
    objectFit = 'cover',
    isLoaded: isLoadedProp,
    className,
    style,
    alt,
    ...props
  },
  ref,
) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoadedState, setIsLoaded] = useState(false);
  const [needsFadeIn, setNeedsFadeIn] = useState(false);
  const isLoaded = isLoadedProp ?? isLoadedState;
  const source = readFragment(ImageFragment, sourceProp);

  // Detect if the image is loaded from cache and skip the fade-in animation
  useLayoutEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    } else {
      setNeedsFadeIn(true);
    }
  }, []);

  // TODO: find a better way to get the intrinsic size of the image
  // Figure out the intrinsic size of the image and scale to max 32x32
  const intrinsicHeight = source?.views[0].height ?? 32;
  const intrinsicWidth = source?.views[0].width ?? 32;
  const aspectRatio = `${intrinsicWidth} / ${intrinsicHeight}`;
  const scale = Math.min(
    BLURHASH_SIZE / intrinsicHeight,
    BLURHASH_SIZE / intrinsicWidth,
  );

  return (
    <div
      className={[styles.container, className].join(' ')}
      style={{ ...style, width, height, aspectRatio }}
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
        ref={imageRef}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        height={height}
        width={width}
        alt={alt}
        className={[
          styles.image,
          needsFadeIn ? styles.fadeIn : null,
          isLoaded ? styles.loaded : null,
        ].join(' ')}
        style={{ objectFit }}
        srcSet={viewsToSrcset(source.views)}
      />
    </div>
  );
});

export default Image;
