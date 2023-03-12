import React, { ReactElement } from 'react';

import Image, { ImageSource } from 'app/components/content/Image';

import { MediaFieldsFragment } from './mediaFields-gql';
import styles from './styles.module.css';

interface QUEmbedMediaProps {
  media: MediaFieldsFragment;
  onSelect: (media: MediaFieldsFragment) => void;
  selected: boolean;
}

export default function Media({
  media,
  onSelect,
  selected,
}: QUEmbedMediaProps): ReactElement {
  let style = {};

  // NOTE: this is temporary
  if (selected) {
    style = {
      backgroundColor: 'green',
    };
  }

  const progress = media.myLibraryEntry?.progress;
  const prefix = media.type.toLowerCase() === 'anime' ? 'ep' : 'ch';
  const progressInfo = progress ? `${prefix}: ${progress}` : ``;

  const imageSource = media.posterImage as ImageSource;

  return (
    <div
      className={styles.mediaItem}
      style={style}
      onClick={() => onSelect(media)}>
      <Image
        className={styles.image}
        source={imageSource}
        width="100%"
        height="100%"
      />
      <div className={styles.title}>
        <div className={styles.preferredTitle}>{media.titles?.preferred}</div>
        <div className={styles.unitType}>{progressInfo}</div>
      </div>
      <div className={styles.description}>{media.description?.en}</div>
    </div>
  );
}
