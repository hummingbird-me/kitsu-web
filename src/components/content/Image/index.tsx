import React, {
  forwardRef,
  HTMLProps,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { BlurhashCanvas } from 'react-blurhash';

import { ImageSource, ImageView } from 'app/types/ImageSource';

import styles from './styles.module.css';

// Max dimension of the blurhash canvas
const BLURHASH_SIZE = 32;

export type ImageProps = HTMLProps<HTMLDivElement> & {
  height: number | string;
  width: number | string;
  source?: ImageSource | null;
  /** How the image should be resized to fit its container. */
  objectFit?: 'contain' | 'cover' | 'fill';
  /** Override the loading state of the image to display the blurhash. */
  isLoaded?: boolean;
  /**
   * The className for the image component. Technically applies to a <div> wrapping the image and
   * blurhash elements.
   */
  className?: string;
};

const viewsToSrcset = (views: readonly ImageView[]) =>
  views
    .filter(({ width }) => width)
    .map(({ width, url }) => `${url} ${width}w`)
    .join(', ');

/**
 * The Image component takes in the API's representation of an image and displays it. It handles:
 *
 * - Displaying a blurhash until the image has finished loading
 * - Generating a `<picture>` tag with all the sizes and formats as sources
 * - Fading in the image when it finishes loading, unless it's loaded from browser cache
 * - Enabling lazy loading on the image
 */
const Image = forwardRef<HTMLDivElement, ImageProps>(function Image(
  {
    height,
    width,
    source,
    objectFit = 'cover',
    isLoaded: isLoadedProp,
    className,
    style,
    ...props
  },
  ref,
) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoadedState, setIsLoaded] = useState(false);
  const [needsFadeIn, setNeedsFadeIn] = useState(false);
  const isLoaded = isLoadedProp ?? isLoadedState;

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
