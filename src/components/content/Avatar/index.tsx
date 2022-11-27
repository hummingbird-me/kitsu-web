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
  } & Partial<ComponentProps<typeof Image>>
> = function ({ source, size, className, ...props }) {
  if (!source) source = DEFAULT_AVATAR;

  return (
    <Image
      className={[styles.avatar, className].join(' ')}
      source={source}
      blurhashSize={6}
      height={size}
      width={size}
      {...props}
    />
  );
};

export default Avatar;
