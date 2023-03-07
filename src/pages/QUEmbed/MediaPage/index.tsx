import React, { ReactElement, useEffect } from 'react';
import { Navigate, redirect, useNavigate } from 'react-router-dom';

import ChosenMedia from 'app/components/QUEmbed/ChosenMedia';
import { MediaFieldsFragment } from 'app/components/QUEmbed/Media/mediaFields-gql';
import { useCreateLibraryEntryMutation } from 'app/components/QUEmbed/createLibraryEntry-gql';
import { useFindMediaByIdAndTypeQuery } from 'app/components/QUEmbed/findMediaByIdAndType-gql';
import { useSearchMediaByTitleQuery } from 'app/components/QUEmbed/searchMediaByTitle-gql';
import { LibraryEntryStatusEnum, MediaTypeEnum } from 'app/graphql/types';
import { kitsuDB } from 'app/utils/indexdb/kitsuDB';
import { CachedRecord } from 'app/utils/quickUpdateEmbedTypes';

export default function MediaPage(): ReactElement {
  const searchParams = new URLSearchParams(window.location.search);
  const { title, externalMediaId, externalMediaSource, mediaType } =
    Object.fromEntries(searchParams);
  const mediaTypeEnum = formattedMediaType(mediaType);

  console.log(
    'Media Page',
    title,
    externalMediaId,
    externalMediaSource,
    mediaTypeEnum
  );
  let shouldPause = false;

  const [cachedRecord, setCachedRecord] = React.useState<CachedRecord | null>(
    null
  );

  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const response: Promise<CachedRecord> = kitsuDB.getFromIndex(
      'mappings',
      'external_media_source_external_media_id_media_type_index',
      [externalMediaSource, externalMediaId, mediaTypeEnum]
    );
    response.then((res) => {
      console.log('Cached Record Found', res);
      setCachedRecord(res);
      setLoading(false);
    });
  }, [loading]);

  const deleteIndexDbRecord = (e) => {
    e.preventDefault();

    if (cachedRecord?.id) {
      const resp = kitsuDB.delete('mappings', cachedRecord.id);
      resp.then(() => {
        setCachedRecord(null);
      });
    }
  };

  if (!cachedRecord) {
    shouldPause = true;
  }

  const mediaQueryVariables = {
    id: cachedRecord?.kitsu_media_id.toString() || '',
    mediaType: mediaTypeEnum,
  };

  console.log('Media Query Variables', mediaQueryVariables);

  const [resultMedia] = useFindMediaByIdAndTypeQuery({
    variables: mediaQueryVariables,
    pause: shouldPause,
  });

  const { data: mediaData, fetching: mediaFetch } = resultMedia;

  if (mediaFetch) {
    return <div>Loading Media...</div>;
  }

  console.log('Media Data Results', mediaData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (mediaData?.findMediaByIdAndType) {
    return (
      <ChosenMedia
        record={mediaData.findMediaByIdAndType}
        deleteIndexDbRecord={deleteIndexDbRecord}
      />
    );
  } else {
    return (
      <Navigate
        to="/search"
        state={{ title, externalMediaId, externalMediaSource, mediaType }}
      />
    );
  }
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
