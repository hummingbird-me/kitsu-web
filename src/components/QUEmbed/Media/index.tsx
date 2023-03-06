import React, { ReactElement } from 'react';

import { MediaFieldsFragment } from './mediaFields-gql';

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

  return (
    <div>
      <div
        onClick={() => {
          onSelect(media);
        }}
        style={style}>
        {media.id} - {media.titles?.preferred} (
        {progress ? `${prefix}: ${progress}` : ``})
      </div>
    </div>
  );
}
