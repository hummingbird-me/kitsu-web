import React, { ReactElement } from 'react';

import {
  LibraryEntryUpdateProgressByMediaInput,
  MediaTypeEnum,
  PostCreateInput,
} from 'app/graphql/types';

import { MediaDataFragment } from '../findMediaByIdAndType-gql';
import { useQuickUpdateMutation } from './quickUpdate-gql';
import { useQuickUpdateNoPostMutation } from './quickUpdateNoPost-gql';

interface QUEmbedProps {
  record: MediaDataFragment;
}

export default function ChosenMedia({ record }: QUEmbedProps): ReactElement {
  const unitType = record.myLibraryEntry?.nextUnit?.__typename;
  const [unitId, setUnitId] = React.useState<string | undefined>(
    record.myLibraryEntry?.nextUnit?.id
  );
  const [unitNumber, setUnitNumber] = React.useState<number>(
    record.myLibraryEntry?.nextUnit?.number || 1
  );

  const [post, setPost] = React.useState<string>('');

  const [, createQuickUpdate] = useQuickUpdateMutation();
  const [, createQuickUpdateNoPost] = useQuickUpdateNoPostMutation();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('progress', unitNumber);
    console.log('post', post);

    const libraryEntryInput: LibraryEntryUpdateProgressByMediaInput = {
      mediaId: record.id,
      mediaType: MediaTypeEnum.Manga,
      progress: unitNumber,
    };

    if (post === '' || post === null) {
      const request = createQuickUpdateNoPost({
        libraryEntryInput,
      });

      request.then((res) => {
        if (res.data?.libraryEntry?.updateProgressByMedia?.errors) {
          console.log('Error updating Library Entry Progress', res);
        } else {
          console.log('Success', res);
          setUnitId(
            res.data?.libraryEntry?.updateProgressByMedia?.libraryEntry
              ?.nextUnit?.id
          );
          setUnitNumber(
            res.data?.libraryEntry?.updateProgressByMedia?.libraryEntry
              ?.nextUnit?.number || unitNumber + 1
          );
          setPost('');
        }
      });
    } else {
      const sfw = record.sfw;
      const postInput: PostCreateInput = {
        content: post,
        mediaId: record.id,
        mediaType: MediaTypeEnum.Manga,
        isSpoiler: true,
        isNsfw: !sfw,
        spoiledUnitId: unitId,
        spoiledUnitType: unitType,
      };

      const request = createQuickUpdate({
        libraryEntryInput,
        postInput,
      });

      request.then((res) => {
        if (res.data?.libraryEntry?.updateProgressByMedia?.errors) {
          console.log('Error updating Library Entry Progress', res);
        } else if (res.data?.post?.create?.errors) {
          console.log('Error creating Post', res);
        } else {
          console.log('Success', res);
          setUnitId(
            res.data?.libraryEntry?.updateProgressByMedia?.libraryEntry
              ?.nextUnit?.id
          );
          setUnitNumber(
            res.data?.libraryEntry?.updateProgressByMedia?.libraryEntry
              ?.nextUnit?.number || unitNumber + 1
          );
          setPost('');
        }
      });
    }
  };

  return (
    <div>
      <h1>{record.titles.preferred}</h1>
      <div>
        <h2>Progress - {unitNumber}</h2>
      </div>
      <div>
        <h2>Post</h2>
        <textarea value={post} onChange={(e) => setPost(e.target.value)} />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
