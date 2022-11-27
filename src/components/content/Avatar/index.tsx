import React, { ComponentProps } from 'react';

import defaultAvatar from 'app/assets/default_avatar.png';
import Image, { ImageSource } from 'app/components/content/Image';

import styles from './styles.module.css';

const DEFAULT_AVATAR: ImageSource = {
  blurhash: 'KNGSM$ofOt~qof9Z9Gof?G',
  views: [
    {
      width: 380,
      height: 380,
      url: defaultAvatar,
    },
  ],
};

const Avatar: React.FC<
  {
    size: number;
    source?: ImageSource;
    className?: string;
  } & Pick<
    ComponentProps<typeof Image>,
    'source' | 'isLoaded' | 'imageClassName' | 'blurhashSize'
  >
> = function ({
  source = DEFAULT_AVATAR,
  size,
  className,
  blurhashSize = 6,
  ...props
}) {
  if (!source) source = DEFAULT_AVATAR;

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
};

export default Avatar;
