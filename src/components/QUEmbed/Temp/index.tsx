import React, { ReactElement, useEffect } from 'react';

import { MediaFieldsFragment } from 'app/components/QUEmbed/Media/mediaFields-gql';
import MediaList from 'app/components/QUEmbed/MediaList';
import { useSearchMediaByTitleQuery } from 'app/components/QUEmbed/searchMediaByTitle-gql';
import { LibraryEntryStatusEnum, MediaTypeEnum } from 'app/graphql/types';
import { kitsuDB } from 'app/utils/indexdb/kitsuDB';

import ChosenMedia from '../ChosenMedia';
import { useCreateLibraryEntryMutation } from '../createLibraryEntry-gql';
import { useFindMediaByIdAndTypeQuery } from '../findMediaByIdAndType-gql';

interface QUEmbedProps {
  externalMediaId: string;
  mediaType: MediaTypeEnum;
  externalMediaSource: string; // TODO: Enum
  title: string;
}

export type MediaRecord = {
  id?: number;
  external_media_source: string;
  external_media_id: string;
  media_type: MediaTypeEnum;
  kitsu_media_id: string;
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

  const [_, createLibraryEntry] = useCreateLibraryEntryMutation();

  useEffect(() => {
    const response: Promise<MediaRecord> = kitsuDB.getFromIndex(
      'mappings',
      'external_media_source_external_media_id_media_type_index',
      [externalMediaSource, externalMediaId, mediaType]
    );
    response.then((res) => {
      console.log('MediaRecord Found', res);
      setMediaRecord(res);
    });
  }, []);

  const handleEntrySubmit = (media: MediaFieldsFragment) => {
    const libraryEntryId = media.myLibraryEntry?.id;

    // Only create a new library entry if one doesn't exist
    if (!libraryEntryId) {
      const request = createLibraryEntry({
        input: {
          mediaId: media.id,
          mediaType: MediaTypeEnum.Manga,
          status: LibraryEntryStatusEnum.Current,
        },
      });

      request.then((res) => {
        if (res.data?.libraryEntry?.create?.errors) {
          console.log('Error creating Library Entry', res);
        } else if (res.data?.libraryEntry?.create?.libraryEntry) {
          console.log('Created Library Entry', res);
        } else {
          console.log('No Library Entry found', res);
        }
      });
    }

    const item: MediaRecord = {
      external_media_source: externalMediaSource,
      external_media_id: externalMediaId,
      media_type: mediaType,
      kitsu_media_id: media.id,
    };

    kitsuDB
      .put('mappings', item)
      .then((res) => {
        item.id = res as number;
        setMediaRecord(item);
      })
      .catch((err) => {
        console.log('Error adding to DB', err);
      });

    console.log('Submitted', item);
  };

  // TODO: figure out how to not need to make the second call again after saving to indexdb.
  if (!mediaRecord) {
    shouldPause = true;
  }

  const mediaQueryVariables = {
    id: mediaRecord?.kitsu_media_id.toString() || '',
    mediaType: MediaTypeEnum.Manga,
  };

  console.log('Should Pause Before Media by Id and Type', shouldPause);

  const [resultMedia] = useFindMediaByIdAndTypeQuery({
    variables: mediaQueryVariables,
    pause: shouldPause,
  });

  const { data: mediaData, fetching: mediaFetch } = resultMedia;

  if (mediaFetch) {
    return <div>Loading Media...</div>;
  }

  console.log('Media Data Results', mediaData);

  if (!mediaData) {
    shouldPause = false;
  } else {
    shouldPause = true;
  }

  console.log('Title', title);
  console.log('Should Pause Before Search', shouldPause);

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

  // HACK: should add a total to the nodes again?
  const totalNodes = searchData?.searchMediaByTitle?.nodes?.length || 0;

  if (mediaData?.findMediaByIdAndType) {
    return (
      <div>
        <ChosenMedia record={mediaData.findMediaByIdAndType} />
      </div>
    );
  } else if (searchData?.searchMediaByTitle && totalNodes > 0) {
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
