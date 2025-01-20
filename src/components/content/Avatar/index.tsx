import React from 'react';

import { source as defaultAvatar } from '@/assets/default_avatar.svg?imageSource';
import Image, {
  type ImageProps,
  type ImageSource,
} from '@/components/content/Image';

import styles from './styles.module.css';

export type AvatarProps = {
  size: number;
  className?: string;
  source?: ImageSource | null;
} & Omit<ImageProps, 'height' | 'width' | 'source'>;

/**
 * Avatars are a special case of Images, representing a user by their chosen profile image. Compared
 * to the Image component, there are a few key differences:
 *
 * - `source` parameter is nullable; a placeholder will be displayed if no source is provided.
 * - `size` parameter is recommended instead of `width` and `height` parameters.
 * - a circular mask is applied to the image.
 */
export default function Avatar({
  source,
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
