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
  kitsuMediaId?: string;
  title?: string;
}

type MediaRecord = {
  external_media_source: string;
  external_media_id: string;
  media_type: MediaTypeEnum;
  kitsu_media_id: string;
  metadata: {
    title: string;
  };
};

export default function Home({
  externalMediaId = '9957316c-eadb-49c5-bc2d-f6cbfe9034a3',
  mediaType = MediaTypeEnum.Manga,
  externalMediaSource = 'mangadex',
  title = 'angel beats',
}: QUEmbedProps): ReactElement {
  let shouldPause = false;
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

  // const { data: libraryData, fetching: libraryFetch } = resultLibrary;

  // if (libraryFetch) {
  //   return <div>Loading Library...</div>;
  // }

  // Pause if the query either returns something or query returns nothing and if the title is null
  // shouldPause =
  //   libraryData?.findLibraryEntryById === null &&
  //   title !== null &&
  //   mediaType !== null
  //     ? false
  //     : true;

  const handleEntrySubmit = (media: MediaFieldsFragment) => {
    const item: MediaRecord = {
      external_media_source: externalMediaSource,
      external_media_id: externalMediaId,
      media_type: mediaType,
      kitsu_media_id: media.id,
      metadata: {
        title: media.titles.preferred,
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
    shouldPause = false;
  }

  const [resultSearch] = useSearchMediaByTitleQuery({
    variables: { title: title, mediaType: mediaType },
    pause: shouldPause,
  });

  const { data: searchData, fetching: searchFetch } = resultSearch;

  if (searchFetch) {
    return <div>Loading Search...</div>;
  }

  // if (libraryData?.findLibraryEntryById) {
  //   return (
  //     <div>
  //       <div>Library Entry</div>
  //       <div>{libraryData.findLibraryEntryById.id}</div>
  //       <div>{libraryData.findLibraryEntryById.media.slug}</div>
  //     </div>
  //   );
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
