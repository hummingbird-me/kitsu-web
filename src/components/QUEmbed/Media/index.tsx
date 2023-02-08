import { Maybe } from 'app/graphql/types';
import React, { ReactElement } from 'react';
import { MediaFieldsFragment } from './mediaFields-gql';

interface QUEmbedMediaProps {
  media: Maybe<MediaFieldsFragment>;
  onSelect: (media: Maybe<MediaFieldsFragment>) => void;
  selected: boolean;
}

export default function Media({
  media,
  onSelect,
  selected
}: QUEmbedMediaProps): ReactElement {
  let style = {};

  // NOTE: this is temporary
  if (selected) {
    style = {
      backgroundColor: 'green'
    };
  }

  return (
    <div>
      <div
        onClick={() => {
          onSelect(media);
        }}
        style={style}>
        {media?.id} - {media?.titles?.preferred}
      </div>
    </div>
  );
}
