import React, { ReactElement, useEffect } from 'react';

import { MediaFieldsFragment } from 'app/components/QUEmbed/Media/mediaFields-gql';
import MediaList from 'app/components/QUEmbed/MediaList';
import { useSearchMediaByTitleQuery } from 'app/components/QUEmbed/searchMediaByTitle-gql';
import { MediaTypeEnum } from 'app/graphql/types';
import { kitsuDB } from 'app/utils/indexdb/kitsuDB';

interface QUEmbedProps {
  externalMediaId: string;
  mediaType: MediaTypeEnum;
  externalMediaSource: string; // TODO: Enum
  title: string;
}

type MediaRecord = {
  external_media_source: string;
  external_media_id: string;
  media_type: MediaTypeEnum;
  kitsu_media_id: string;
  library_entry_id?: string;
  progress: number;
  metadata: {
    title: string;
    poster_image?: string;
    banner_image?: string;
  };
};

export default function Temp({
  externalMediaId,
  mediaType,
  externalMediaSource,
  title,
}: QUEmbedProps): ReactElement {
  let shouldPause = false;

  // Add search params to an object or something
  const [mediaRecord, setMediaRecord] = React.useState<MediaRecord | null>(
    null
  );

  useEffect(() => {
    const response: Promise<MediaRecord> = kitsuDB.get('mappings', [
      externalMediaSource,
      externalMediaId,
      mediaType,
    ]);
    response.then((res) => {
      setMediaRecord(res);
    });
  }, []);

  const handleEntrySubmit = (media: MediaFieldsFragment) => {
    const item: MediaRecord = {
      external_media_source: externalMediaSource,
      external_media_id: externalMediaId,
      media_type: mediaType,
      kitsu_media_id: media.id,
      library_entry_id: media.myLibraryEntry?.id,
      progress: media.myLibraryEntry?.progress || 0,
      metadata: {
        title: media.titles.preferred,
        poster_image: media.posterImage?.original?.url,
        banner_image: media.bannerImage?.original?.url,
      },
    };

    console.log('Submitted', item);

    setMediaRecord(item);

    kitsuDB
      .put('mappings', item)
      .then((res) => {
        console.log('Added to DB', res);
      })
      .catch((err) => {
        console.log('Error adding to DB', err);
      });
  };

  if (mediaRecord) {
    console.log('Found', mediaRecord);
    shouldPause = true;
  }

  console.log('Should Pause?', shouldPause);

  const [resultSearch] = useSearchMediaByTitleQuery({
    // variables: { title: title, mediaType: mediaType },
    // NOTE: something is wonky with the enum type
    variables: { title: title, mediaType: MediaTypeEnum.Manga },
    pause: shouldPause,
  });

  const { data: searchData, fetching: searchFetch } = resultSearch;

  if (searchFetch) {
    return <div>Loading Search...</div>;
  }

  console.log('Search Data Results', searchData);

  if (mediaRecord) {
    return (
      <div>
        <div>Library Entry Found!</div>
      </div>
    );
  } else if (searchData?.searchMediaByTitle) {
    return (
      <div>
        <MediaList
          entries={searchData.searchMediaByTitle}
          onSubmit={handleEntrySubmit}
        />
      </div>
    );
  } else {
    return <div>Missing</div>;
  }
}
