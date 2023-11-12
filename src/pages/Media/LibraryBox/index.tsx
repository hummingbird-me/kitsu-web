import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button, {
  ButtonColor,
  ButtonKind,
  ButtonSize,
} from 'app/components/controls/Button';
import GroupBox from 'app/components/GroupBox';
import { MediaTypeEnum } from 'app/graphql/types';

import { LibraryBoxFieldsFragment } from './fields-gql';
import styles from './styles.module.css';

type LibraryBoxParams = { media: LibraryBoxFieldsFragment };

function AddToLibraryBox({ media }: LibraryBoxParams): JSX.Element {
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
        {media.type === MediaTypeEnum.Anime ? (
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
        {media.type === MediaTypeEnum.Anime ? (
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

function EditLibraryBox({ media }: LibraryBoxParams) {
  const { formatMessage } = useIntl();

  return (
    <GroupBox
      title={formatMessage({
        defaultMessage: 'Edit Library',
        description: 'Header for library entry edit sidebar',
      })}
      className={styles.libraryGroupBox}>
      <Button kind={ButtonKind.PRIMARY} size={ButtonSize.SMALL}>
        <FormattedMessage
          defaultMessage="Completed"
          description="Action button to mark show as seen"
        />
      </Button>
    </GroupBox>
  );
}

export default function LibraryBox({ media }: LibraryBoxParams): JSX.Element {
  if (!media.myLibraryEntry) {
    return <AddToLibraryBox media={media} />;
  } else {
    return <EditLibraryBox media={media} />;
  }
}
