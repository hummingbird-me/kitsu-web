import React, { ReactElement } from 'react';

import Media from '../Media';
import { MediaFieldsFragment } from '../Media/mediaFields-gql';
import { MediaListConnectionFragment } from './mediaListConnection-gql';
import styles from './styles.module.css';

interface QUEmbedMediaListProps {
  entries: MediaListConnectionFragment;
  onSubmit: (media: MediaFieldsFragment) => void;
}

export default function MediaList({
  entries,
  onSubmit,
}: QUEmbedMediaListProps): ReactElement {
  const [selectedMedia, setSelectedMedia] =
    React.useState<MediaFieldsFragment | null>(null);

  if (entries == null || entries.nodes == null) {
    return <div>Nothing to see here</div>;
  }

  const handleSelect = (media: MediaFieldsFragment) => {
    console.log('selected', media);
    setSelectedMedia(media);
  };

  // TODO: Work with MediaFieldsFragment
  const existingMediaLibraryEntry: JSX.Element[] = [];
  const newMediaLibraryEntry: JSX.Element[] = [];

  entries.nodes.forEach((media: any): void => {
    const formattedMedia = media as MediaFieldsFragment;
    const selected = formattedMedia.id === selectedMedia?.id ? true : false;
    const record = (
      <Media
        key={formattedMedia.id}
        media={formattedMedia}
        onSelect={handleSelect}
        selected={selected}
      />
    );

    if (formattedMedia.myLibraryEntry?.id) {
      existingMediaLibraryEntry.push(record);
    } else {
      newMediaLibraryEntry.push(record);
    }
  });
  return (
    <div id="media-list-container">
      <div className={styles.column}>
        <div className={styles.resultsContainer}>
          <div className={styles.resultHeader}>{'In Library'}</div>
          {existingMediaLibraryEntry}
          <div className={styles.resultHeader}>{'Not In Library'}</div>
          {newMediaLibraryEntry}
          {selectedMedia && (
            <button
              onClick={() => {
                onSubmit(selectedMedia);
              }}>
              {'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
