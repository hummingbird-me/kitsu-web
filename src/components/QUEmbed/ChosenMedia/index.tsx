import React, { ReactElement } from 'react';

import BannerImage from 'app/components/BannerImage';
import { ImageSource } from 'app/components/content/Image';
import {
  LibraryEntryUpdateProgressByMediaInput,
  PostCreateInput,
} from 'app/graphql/types';
import { formattedMediaType } from 'app/pages/QUEmbed/MediaPage';

import { MediaDataFragment } from '../findMediaByIdAndType-gql';
import { useQuickUpdateMutation } from './quickUpdate-gql';
import { useQuickUpdateNoPostMutation } from './quickUpdateNoPost-gql';
import styles from './styles.module.css';

interface QUEmbedProps {
  record: MediaDataFragment;
}

export default function ChosenMedia({ record }: QUEmbedProps): ReactElement {
  const unitType = record.myLibraryEntry?.nextUnit?.__typename;
  const unitPrefix = unitType === 'Episode' ? 'Watching' : 'Reading';
  const [unitId, setUnitId] = React.useState<string | undefined>(
    record.myLibraryEntry?.nextUnit?.id
  );
  const [unitNumber, setUnitNumber] = React.useState<number>(
    record.myLibraryEntry?.nextUnit?.number || 1
  );

  const [post, setPost] = React.useState<string>('');
  const kitsuUrl = `https://kitsu.io/${record.type.toLowerCase()}/${
    record.slug
  }`;
  const background = record.bannerImage as ImageSource;

  const [, createQuickUpdate] = useQuickUpdateMutation();
  const [, createQuickUpdateNoPost] = useQuickUpdateNoPostMutation();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('progress', unitNumber);
    console.log('post', post);

    const libraryEntryInput: LibraryEntryUpdateProgressByMediaInput = {
      mediaId: record.id,
      mediaType: formattedMediaType(record.type),
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
        mediaType: formattedMediaType(record.type),
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
    <>
      <div className={styles.bannerImage}>
        <BannerImage className={styles.image} background={background}>
          <h1 className={styles.title}>
            <a href={kitsuUrl} target="_blank" rel="noreferrer">
              {record.titles.preferred}
            </a>
          </h1>
        </BannerImage>
      </div>
      <textarea
        className={styles.post}
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />
      <div className={styles.footer}>
        <button
          className={styles.submit}
          onClick={
            handleSubmit
          }>{`Completed ${unitPrefix} ${unitNumber}`}</button>
      </div>
    </>
  );
}
