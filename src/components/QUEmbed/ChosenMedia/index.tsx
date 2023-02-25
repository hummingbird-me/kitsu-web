import React, { ReactElement } from 'react';

import { MediaTypeEnum } from 'app/graphql/types';
import { kitsuDB } from 'app/utils/indexdb/kitsuDB';

import { MediaRecord } from '../Temp';
import { useQuickUpdateMutation } from './quickUpdate-gql';
import { useQuickUpdateNoPostMutation } from './quickUpdateNoPost-gql';

interface QUEmbedProps {
  record: MediaRecord;
}

export default function ChosenMedia({ record }: QUEmbedProps): ReactElement {
  const [progress, setProgress] = React.useState<number>(record.progress + 1);
  const [post, setPost] = React.useState<string>('');

  const [, createQuickUpdate] = useQuickUpdateMutation();
  const [, createQuickUpdateNoPost] = useQuickUpdateNoPostMutation();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('progress', progress);
    console.log('post', post);

    record.progress = progress;

    kitsuDB.put('mappings', record).then((res) => {
      console.log('Updated', res);
    });

    const libraryEntryInput = {
      mediaId: record.kitsu_media_id,
      mediaType: MediaTypeEnum.Manga,
      progress,
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
        }
      });
    } else {
      const postInput = {
        content: post,
        mediaId: record.kitsu_media_id,
        mediaType: MediaTypeEnum.Manga,
        isSpoiler: true,
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
        }
      });
    }

    setProgress(progress + 1);
    setPost('');
  };

  return (
    <div>
      <h1>{record.metadata.title}</h1>
      <div>
        <h2>Progress</h2>
        <input
          type="number"
          min="0"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
        />
      </div>
      <div>
        <h2>Post</h2>
        <textarea value={post} onChange={(e) => setPost(e.target.value)} />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
