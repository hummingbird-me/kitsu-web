import React, { ReactElement } from 'react';

import Media from '../Media';
import { MediaFieldsFragment } from '../Media/mediaFields-gql';
import { MediaListConnectionFragment } from './mediaListConnection-gql';

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
    <div>
      <div>
        <h3>In your Library</h3>
        <div>{existingMediaLibraryEntry}</div>
      </div>
      <div>
        <h3>Not in your Library</h3>
        <div>{newMediaLibraryEntry}</div>
      </div>
      {selectedMedia && (
        <button
          onClick={() => {
            onSubmit(selectedMedia);
          }}>
          {'Submit'}
        </button>
      )}
    </div>
  );
}
