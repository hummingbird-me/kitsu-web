import React, { useId } from 'react';
import { useIntl } from 'react-intl';

import SearchIcon from '@/assets/icons/search.svg?react';

import styles from './styles.module.css';

export default function SearchBox({ className }: { className?: string }) {
  const searchId = useId();
  const { formatMessage } = useIntl();

  return (
    <div className={[styles.Container, className].join(' ')}>
      <label htmlFor={searchId}>
        <SearchIcon className={styles.Icon} />
      </label>
      <input
        className={styles.Input}
        type="search"
        placeholder={formatMessage({
          id: 'components.application.nav-search',
          defaultMessage: 'Search Kitsu',
          description: 'Placeholder text for search field',
        })}
        id={searchId}
      />
    </div>
  );
}
