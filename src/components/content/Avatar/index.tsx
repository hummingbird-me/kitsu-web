import React from 'react';

import { source as defaultAvatar } from 'app/assets/default_avatar.svg?imageSource';
import Image, { ImageProps } from 'app/components/content/Image';
import { ImageSource } from 'app/types/ImageSource';

import styles from './styles.module.css';

export type AvatarProps = {
  size: number;
  source?: ImageSource;
  className?: string;
} & Pick<ImageProps, 'source' | 'isLoaded'>;

/**
 * Avatars are a special case of Images, representing a user by their chosen profile image. Compared
 * to the Image component, there are a few key differences:
 *
 * - `source` parameter is nullable; a placeholder will be displayed if no source is provided.
 * - `size` parameter is recommended instead of `width` and `height` parameters.
 * - a circular mask is applied to the image.
 */
export default function Avatar({
  source = defaultAvatar,
  size,
  className,
  ...props
}: AvatarProps): JSX.Element {
  if (!source) source = defaultAvatar;

  return (
    <Image
      className={[styles.avatar, className].join(' ')}
      source={source}
      objectFit="cover"
      height={size}
      width={size}
      {...props}
    />
  );
}
