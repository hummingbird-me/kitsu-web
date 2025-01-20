import React from 'react';

import { source as defaultPoster } from 'app/assets/default_poster.jpg?imageSource';

import Image, { type ImageProps, type ImageSource } from '../Image';
import styles from './styles.module.css';

// This is the aspect ratio of an A size paper, which is common for posters.
const ASPECT_RATIO = Math.SQRT2;

// This is a bit verbose but basically expresses that we want to require at least one of height or
// width. This is necessary because we need to calculate the other dimension from the aspect ratio.
type PosterWithHeight = {
  height: number;
  width?: number;
};
type PosterWithWidth = {
  width: number;
  height?: number;
};
type PosterWithBoth = {
  height: number;
  width: number;
};

export type PosterImageProps = Omit<
  ImageProps,
  'height' | 'width' | 'source'
> & { source: ImageSource | undefined | null } & (
    | PosterWithHeight
    | PosterWithWidth
    | PosterWithBoth
  );

/**
 * A poster image with a portrait aspect ratio. This is a thin wrapper around the Image component,
 * which calculates the width or height based on the poster aspect ratio if only one is provided.
 */
export default function PosterImage({
  height,
  width,
  source = defaultPoster,
  className,
  ...args
}: PosterImageProps) {
  // Default calculated from aspect ratio if only one dimension is provided.
  if (height) width ??= height / ASPECT_RATIO;
  if (width) height ??= width * ASPECT_RATIO;

  // We are guaranteed to have both of these by the above logic and the input types.
  return (
    <Image
      height={height}
      width={width}
      source={source ?? defaultPoster}
      className={[styles.posterImage, className].join(' ')}
      {...args}
    />
  );
}
