import React, { ReactElement } from 'react';
import { useFindLibraryEntryByIdQuery } from 'app/components/QUEmbed/findLibraryEntryById-gql';
import { useSearchMediaByTitleQuery } from 'app/components/QUEmbed/searchMediaByTitle-gql';
import { Maybe, MediaTypeEnum } from 'app/graphql/types';
import MediaList from 'app/components/QUEmbed/MediaList';
import { MediaFieldsFragment } from 'app/components/QUEmbed/Media/mediaFields-gql';

interface QUEmbedProps {
  externalMediaId: string;
  mediaType: MediaTypeEnum;
  externalMediaSource: string; // TODO: Enum
  kitsuMediaId?: string;
  title?: string;
}

export default function Home({
  externalMediaId,
  mediaType = MediaTypeEnum.Manga,
  externalMediaSource,
  kitsuMediaId = '1234',
  title = 'angel'
}: QUEmbedProps): ReactElement {
  const shouldPause = false;
  // const shouldPause = kitsuMediaId === null ? true : false;
  // const [resultLibrary] = useFindLibraryEntryByIdQuery({
  //   variables: { id: libraryEntryId || '' },
  //   pause: shouldPause
  // });

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

  const handleEntrySubmit = (media: Maybe<MediaFieldsFragment>) => {
    console.log('handleEntrySubmit', media);
  };

  const [resultSearch] = useSearchMediaByTitleQuery({
    variables: { title: title || '', mediaType: mediaType },
    pause: shouldPause
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
  if (searchData?.searchMediaByTitle) {
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
