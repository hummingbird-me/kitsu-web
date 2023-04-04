import React, { ReactElement } from 'react';

import { ActiveTabs } from 'app/pages/QUEmbed/MediaPage';

import styles from './styles.module.css';

interface Props {
  onClickUnlink: (e: any) => void;
  onClickActiveTab: (tab: ActiveTabs) => void;
}

export default function ChosenMediaHeader({
  onClickUnlink,
  onClickActiveTab,
}: Props): ReactElement {
  return (
    <nav className={styles.headers}>
      <li
        className={styles.chosenMedia}
        onClick={() => onClickActiveTab('media')}>
        {'Media'}
      </li>
      <li
        className={styles.reaction}
        onClick={() => onClickActiveTab('reaction')}>
        {'Reaction'}
      </li>
      <li className={styles.rating} onClick={() => onClickActiveTab('rating')}>
        {'Rating'}
      </li>
      <li className={styles.unlink}>
        <button onClick={onClickUnlink}>{'Unlink'}</button>
      </li>
    </nav>
  );
}
