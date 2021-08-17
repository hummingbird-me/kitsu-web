import React from 'react';

import Image, { ImageSource } from 'app/components/Image';

import styles from './styles.module.css';

const BannerImage: React.FC<{ background: ImageSource }> = function ({
  background,
  children,
}) {
  return (
    <div className={styles.container}>
      <Image
        source={background}
        height="100%"
        width="100%"
        className={styles.background}
      />
      <div className={styles.overlay}>{children}</div>
    </div>
  );
};

export default BannerImage;
