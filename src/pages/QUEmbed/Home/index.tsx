import React, { ReactElement } from 'react';

import Temp from 'app/components/QUEmbed/Temp';
import { MediaTypeEnum } from 'app/graphql/types';

export default function Home(): ReactElement {
  const searchParams = new URLSearchParams(window.location.search);
  const { title, externalMediaId, externalMediaSource, mediaType } =
    Object.fromEntries(searchParams);
  const formattedMediaType: MediaTypeEnum = mediaType as MediaTypeEnum;

  console.log('title', title);
  console.log('externalMediaId', externalMediaId);
  console.log('externalMediaSource', externalMediaSource);
  console.log('mediaType', mediaType);

  return (
    <Temp
      title={title}
      externalMediaId={externalMediaId}
      externalMediaSource={externalMediaSource}
      mediaType={formattedMediaType}
    />
  );
}
