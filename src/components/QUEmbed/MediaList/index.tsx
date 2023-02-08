import React, { ReactElement } from 'react';
import Media from '../Media';
import { Maybe } from 'app/graphql/types';
import { MediaListConnectionFragment } from './mediaListConnection-gql';
import { MediaFieldsFragment } from '../Media/mediaFields-gql';

interface QUEmbedMediaListProps {
  entries: MediaListConnectionFragment;
  onSubmit: (media: Maybe<MediaFieldsFragment>) => void;
}

export default function MediaList({
  entries,
  onSubmit
}: QUEmbedMediaListProps): ReactElement {
  const [selectedMedia, setSelectedMedia] =
    React.useState<Maybe<MediaFieldsFragment>>(null);

  if (entries == null || entries.nodes == null) {
    return <div>Nothing to see here</div>;
  }

  const handleSelect = (media: Maybe<MediaFieldsFragment>) => {
    setSelectedMedia(media);
  };

  // TODO: Work with MediaFieldsFragment
  const renderedList = entries?.nodes.map((media: any): JSX.Element => {
    const selected = media?.id == selectedMedia?.id ? true : false;
    return (
      <Media
        key={media?.id}
        media={media}
        onSelect={handleSelect}
        selected={selected}
      />
    );
  });

  return (
    <div>
      <div>{renderedList}</div>
      <button
        onClick={() => {
          onSubmit(selectedMedia);
        }}>
        Submit
      </button>
    </div>
  );
}
