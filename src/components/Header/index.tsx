import React, { useState } from 'react';
import { uniqueId } from 'lodash-es';
import { useWindowScroll } from 'react-use';
import { Link, useLocation } from 'react-router-dom';

import logo from 'app/assets/logo.svg';
import { ReactComponent as SearchIcon } from 'app/assets/icons/search.svg';
import utilStyles from 'app/styles/utils.module.css';
import { useSession } from 'app/contexts/SessionContext';
import ModalLink from 'app/components/ModalLink';

import AvatarMenu from './AvatarMenu';
import styles from './styles.module.css';

export default function Header({
  background = 'opaque',
  scrollBackground = 'opaque',
}: {
  background?: 'opaque' | 'transparent';
  scrollBackground?: 'opaque' | 'transparent';
}) {
  // We don't expect to have this multiple times per page but we should still be careful
  const [searchId] = useState(() => uniqueId('header-search-'));
  const { session } = useSession();
  const { y } = useWindowScroll();
  const displayBackground = y > 0 ? scrollBackground : background;

  return (
    <header className={[styles.header, styles[displayBackground]].join(' ')}>
      <nav
        className={[
          utilStyles.container,
          session ? styles.loggedIn : null,
          styles.container,
        ].join(' ')}>
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
        {session ? (
          <>
            <a
              className={[styles.circular, styles.notificationCount].join(' ')}>
              3
            </a>
            <AvatarMenu className={styles.avatar} />
          </>
        ) : (
          <div className={styles.authCta}>
            <ModalLink to="/auth/sign-up">Sign Up</ModalLink>
            {' or '}
            <ModalLink to="/auth/sign-in">Sign In</ModalLink>
          </div>
        )}
      </nav>
    </header>
  );
}
