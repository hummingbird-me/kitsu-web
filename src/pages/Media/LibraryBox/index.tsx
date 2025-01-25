import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button, {
  ButtonColor,
  ButtonKind,
  ButtonSize,
} from '@/components/controls/Button';
import GroupBox from '@/components/GroupBox';
import { graphql, readFragment, type FragmentOf } from '@/graphql/tada';

import styles from './styles.module.css';

export const LibraryBoxFragment = graphql(`
  fragment LibraryBoxFragment on Media {
    type
    id
    myLibraryEntry {
      id
      status
      progress
      rating
      reconsumeCount
      reconsuming
    }
  }
`);

export type LibraryBoxParams = { media: FragmentOf<typeof LibraryBoxFragment> };

function AddToLibraryBox(props: LibraryBoxParams) {
  const media = readFragment(LibraryBoxFragment, props.media);
  const { formatMessage } = useIntl();

  return (
    <GroupBox
      title={formatMessage({
        defaultMessage: 'Add to Library',
        description: 'Header for add to library sidebar',
      })}
      className={styles.libraryGroupBox}>
      <Button
        kind={ButtonKind.SOLID}
        size={ButtonSize.MEDIUM}
        color={ButtonColor.GREEN}
        className={styles.libraryButton}>
        <FormattedMessage
          defaultMessage="Completed"
          description="Action button to mark show as seen"
        />
      </Button>
      <Button
        kind={ButtonKind.SOLID}
        size={ButtonSize.MEDIUM}
        color={ButtonColor.BLUE}
        className={styles.libraryButton}>
        {media.type === 'ANIME' ? (
          <FormattedMessage
            defaultMessage="Want to Watch"
            description="Action button to mark show as want to watch"
          />
        ) : (
          <FormattedMessage
            defaultMessage="Want to Read"
            description="Action button to mark book as want to read"
          />
        )}
      </Button>
      <Button
        kind={ButtonKind.SOLID}
        size={ButtonSize.MEDIUM}
        color={ButtonColor.PURPLE}
        className={styles.libraryButton}>
        {media.type === 'ANIME' ? (
          <FormattedMessage
            defaultMessage="Started Watching"
            description="Action button to mark show as started"
          />
        ) : (
          <FormattedMessage
            defaultMessage="Started Reading"
            description="Action button to mark book as started"
          />
        )}
      </Button>
    </GroupBox>
  );
}

function EditLibraryBox(props: LibraryBoxParams) {
  const media = readFragment(LibraryBoxFragment, props.media);
  const { formatMessage } = useIntl();

  return (
    <GroupBox
      title={formatMessage({
        defaultMessage: 'Edit Library',
        description: 'Header for library entry edit sidebar',
      })}
      className={styles.libraryGroupBox}>
      <Button
        kind={ButtonKind.SOLID}
        size={ButtonSize.SMALL}
        color={ButtonColor.GREEN}>
        <FormattedMessage
          defaultMessage="Completed"
          description="Action button to mark show as seen"
        />
      </Button>
    </GroupBox>
  );
}

export default function LibraryBox(props: LibraryBoxParams) {
  const media = readFragment(LibraryBoxFragment, props.media);

  if (!media.myLibraryEntry) {
    return <AddToLibraryBox {...props} />;
  } else {
    return <EditLibraryBox {...props} />;
  }
}
