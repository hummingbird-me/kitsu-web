import React, { ReactElement } from 'react';

import { MediaTypeEnum } from 'app/graphql/types';

import SearchPage from '../SearchPage';

export default function Home(): ReactElement {
  const searchParams = new URLSearchParams(window.location.search);
  const { title, externalMediaId, externalMediaSource, mediaType } =
    Object.fromEntries(searchParams);
  const mediaTypeEnum = formattedMediaType(mediaType);

  console.log(
    'searchParams',
    title,
    externalMediaId,
    externalMediaSource,
    mediaTypeEnum
  );

  return (
    <SearchPage
      title={title}
      externalMediaId={externalMediaId}
      externalMediaSource={externalMediaSource}
      mediaType={mediaTypeEnum}
    />
  );

  // <MediaPage record={media} deleteIndexDbRecord={deleteIndexDbRecord} />
}

export function formattedMediaType(mediaType: string): MediaTypeEnum {
  switch (mediaType.toLowerCase()) {
    case 'anime':
      return MediaTypeEnum.Anime;
    case 'manga':
      return MediaTypeEnum.Manga;
    default:
      return MediaTypeEnum.Manga;
  }
}
