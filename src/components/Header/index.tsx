import React, { useState } from 'react';
import { uniqueId } from 'lodash-es';

import logo from 'app/assets/logo.svg';
import { ReactComponent as SearchIcon } from 'app/assets/icons/search.svg';
import utilStyles from 'app/styles/utils.module.css';

import AvatarMenu from './AvatarMenu';
import styles from './styles.module.css';

export default function Header({
  background = 'opaque',
}: {
  background: 'opaque' | 'transparent';
}) {
  // We don't expect to have this multiple times per page but we should still be careful
  const [searchId] = useState(() => uniqueId('header-search-'));

  return (
    <header className={[styles.header, styles.opaque].join(' ')}>
      <nav className={[utilStyles.container, styles.container].join(' ')}>
        <a href="/" className={styles.logo}>
          <img src={logo} />
        </a>
        <ul className={styles.navList}>
          <li>
            <a href="#">Library</a>
          </li>
          <li>
            <a href="#">Browse</a>
          </li>
          <li>
            <a href="#">Groups</a>
          </li>
          <li>
            <a href="#">Feedback</a>
          </li>
        </ul>
        <div className={styles.search}>
          <label htmlFor={searchId}>
            <SearchIcon className={styles.icon} />
          </label>
          <input type="search" placeholder="Search Kitsu" id={searchId} />
        </div>
        <a className={[styles.circular, styles.notificationCount].join(' ')}>
          3
        </a>
        <AvatarMenu className={styles.avatar} />
      </nav>
    </header>
  );
}
