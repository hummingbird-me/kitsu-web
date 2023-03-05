import React, { ReactElement, useEffect } from 'react';

import { MediaFieldsFragment } from 'app/components/QUEmbed/Media/mediaFields-gql';
import MediaList from 'app/components/QUEmbed/MediaList';
import { useCreateLibraryEntryMutation } from 'app/components/QUEmbed/createLibraryEntry-gql';
import { useFindMediaByIdAndTypeQuery } from 'app/components/QUEmbed/findMediaByIdAndType-gql';
import { useSearchMediaByTitleQuery } from 'app/components/QUEmbed/searchMediaByTitle-gql';
import { LibraryEntryStatusEnum, MediaTypeEnum } from 'app/graphql/types';
import { kitsuDB } from 'app/utils/indexdb/kitsuDB';

import MediaPage from '../MediaPage';

interface Props {
  externalMediaId: string;
  mediaType: MediaTypeEnum;
  externalMediaSource: string; // TODO: Enum
  title: string;
}

export type CachedRecord = {
  id?: number;
  external_media_source: string;
  external_media_id: string;
  media_type: MediaTypeEnum;
  kitsu_media_id: string;
};

export default function SearchPage({
  externalMediaId,
  mediaType,
  externalMediaSource,
  title,
}: Props): ReactElement {
  let shouldPause = false;

  const [cachedRecord, setCachedRecord] = React.useState<CachedRecord | null>(
    null
  );

  useEffect(() => {
    const response: Promise<CachedRecord> = kitsuDB.getFromIndex(
      'mappings',
      'external_media_source_external_media_id_media_type_index',
      [externalMediaSource, externalMediaId, mediaType]
    );
    response.then((res) => {
      console.log('Cached Record Found', res);
      setCachedRecord(res);
    });
  }, []);

  const [, createLibraryEntry] = useCreateLibraryEntryMutation();
  const handleEntrySubmit = (media: MediaFieldsFragment) => {
    const libraryEntryId = media.myLibraryEntry?.id;

    // Only create a new library entry if one doesn't exist
    if (!libraryEntryId) {
      const request = createLibraryEntry({
        input: {
          mediaId: media.id,
          mediaType: mediaType,
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

    const item: CachedRecord = {
      external_media_source: externalMediaSource,
      external_media_id: externalMediaId,
      media_type: mediaType,
      kitsu_media_id: media.id,
    };

    kitsuDB
      .put('mappings', item)
      .then((res) => {
        item.id = res as number;
        setCachedRecord(item);
      })
      .catch((err) => {
        console.log('Error adding to DB', err);
      });

    console.log('Submitted', item);
  };

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
    mediaType: mediaType,
  };

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

  console.log('Media Type', mediaType);

  const [resultSearch] = useSearchMediaByTitleQuery({
    // variables: { title: title, mediaType: mediaType },
    // NOTE: something is wonky with the enum type
    variables: { title: title, mediaType: mediaType },
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
      <MediaPage
        record={mediaData.findMediaByIdAndType}
        deleteIndexDbRecord={deleteIndexDbRecord}
      />
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
