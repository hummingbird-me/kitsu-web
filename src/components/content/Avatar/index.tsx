import React, { ComponentProps } from 'react';

import { source as defaultAvatar } from 'app/assets/default_avatar.png';
import Image, { ImageSource } from 'app/components/content/Image';

import styles from './styles.module.css';

export type AvatarProps = {
  size: number;
  source?: ImageSource;
  className?: string;
} & Pick<
  ComponentProps<typeof Image>,
  'source' | 'isLoaded' | 'imageClassName' | 'blurhashSize'
>;

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
  blurhashSize = 6,
  ...props
}: AvatarProps): JSX.Element {
  if (!source) source = defaultAvatar;

  return (
    <Image
      className={[styles.avatar, className].join(' ')}
      source={source}
      blurhashSize={blurhashSize}
      objectFit="cover"
      height={size}
      width={size}
      {...props}
    />
  );
}
