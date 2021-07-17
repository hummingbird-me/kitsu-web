import React, { useState } from 'react';
import { uniqueId } from 'lodash-es';
import { Link, useLocation } from 'react-router-dom';

import logo from 'app/assets/logo.svg';
import { ReactComponent as SearchIcon } from 'app/assets/icons/search.svg';
import utilStyles from 'app/styles/utils.module.css';

import styles from './styles.module.css';

export default function Header({
  background = 'opaque',
}: {
  background: 'opaque' | 'transparent';
}) {
  // We don't expect to have this multiple times per page but we should still be careful
  const [searchId] = useState(() => uniqueId('header-search-'));
  const location = useLocation();

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
        <Link
          className={styles.avatar}
          to={{
            pathname: '/auth/log-in',
            search: `?returnTo=${location.pathname}`,
            state: { background: location },
          }}>
          <img
            src="https://media.kitsu.io/users/avatars/5554/small.jpeg?1597552193"
            className={styles.circular}
          />
        </Link>
      </nav>
    </header>
  );
}
