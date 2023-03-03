import React, { ReactElement } from 'react';

import { MediaTypeEnum } from 'app/graphql/types';

import SearchPage from '../SearchPage';

export default function Home(): ReactElement {
  const searchParams = new URLSearchParams(window.location.search);
  const { title, externalMediaId, externalMediaSource, mediaType } =
    Object.fromEntries(searchParams);
  const formattedMediaType: MediaTypeEnum = mediaType as MediaTypeEnum;

  console.log(
    'searchParams',
    title,
    externalMediaId,
    externalMediaSource,
    mediaType
  );

  return (
    <SearchPage
      title={title}
      externalMediaId={externalMediaId}
      externalMediaSource={externalMediaSource}
      mediaType={formattedMediaType}
    />
  );

  // <MediaPage record={media} deleteIndexDbRecord={deleteIndexDbRecord} />
}
