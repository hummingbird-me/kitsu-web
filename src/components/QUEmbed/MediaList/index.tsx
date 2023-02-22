import React, { ReactElement, useEffect } from 'react';

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
  const renderedList = entries.nodes.map((media: any): JSX.Element => {
    const formattedMedia = media as MediaFieldsFragment;
    const selected = formattedMedia.id === selectedMedia?.id ? true : false;
    return (
      <Media
        key={formattedMedia.id}
        media={formattedMedia}
        onSelect={handleSelect}
        selected={selected}
      />
    );
  });

  return (
    <div>
      <div>{renderedList}</div>
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
