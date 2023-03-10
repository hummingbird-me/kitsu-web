import React, { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { MediaFieldsFragment } from 'app/components/QUEmbed/Media/mediaFields-gql';
import MediaList from 'app/components/QUEmbed/MediaList';
import { useCreateLibraryEntryMutation } from 'app/components/QUEmbed/createLibraryEntry-gql';
import { useFindMediaByIdAndTypeQuery } from 'app/components/QUEmbed/findMediaByIdAndType-gql';
import { useSearchMediaByTitleQuery } from 'app/components/QUEmbed/searchMediaByTitle-gql';
import { LibraryEntryStatusEnum, MediaTypeEnum } from 'app/graphql/types';
import { kitsuDB } from 'app/utils/indexdb/kitsuDB';
import { CachedRecord } from 'app/utils/quickUpdateEmbedTypes';

import { formattedMediaType } from '../MediaPage';

export default function SearchPage(): ReactElement {
  const searchParams = new URLSearchParams(window.location.search);
  const { title, externalMediaId, externalMediaSource, mediaType } =
    Object.fromEntries(searchParams);
  const mediaTypeEnum = formattedMediaType(mediaType);

  console.log(
    'Search Page',
    title,
    externalMediaId,
    externalMediaSource,
    mediaTypeEnum
  );

  const navigate = useNavigate();

  const [, createLibraryEntry] = useCreateLibraryEntryMutation();
  const handleEntrySubmit = (media: MediaFieldsFragment) => {
    const libraryEntryId = media.myLibraryEntry?.id;

    // Only create a new library entry if one doesn't exist
    if (!libraryEntryId) {
      const request = createLibraryEntry({
        input: {
          mediaId: media.id,
          mediaType: mediaTypeEnum,
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
      media_type: mediaTypeEnum,
      kitsu_media_id: media.id,
    };

    kitsuDB
      .put('mappings', item)
      .then(() => {
        console.log('Added to DB', item);
        navigate('/', {
          state: { title, externalMediaId, externalMediaSource, mediaType },
        });
      })
      .catch((err) => {
        console.log('Error adding to DB', err);
      });

    console.log('Submitted', item);
  };

  const [resultSearch] = useSearchMediaByTitleQuery({
    variables: { title: title, mediaType: mediaTypeEnum },
  });

  const { data: searchData, fetching: searchFetch } = resultSearch;

  if (searchFetch) {
    return <div>Loading Search...</div>;
  }

  console.log('Search Data Results', searchData);

  // HACK: should add a total to the nodes again?
  const totalNodes = searchData?.searchMediaByTitle?.nodes?.length || 0;

  if (searchData?.searchMediaByTitle && totalNodes > 0) {
    return (
      <div>
        <MediaList
          entries={searchData.searchMediaByTitle}
          onSubmit={handleEntrySubmit}
        />
      </div>
    );
  } else {
    return <div>Missing Data</div>;
  }
}
