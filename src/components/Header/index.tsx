import React, { useState } from 'react';
import { uniqueId } from 'lodash-es';
import { useWindowScroll } from 'react-use';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import logo from 'app/assets/logo.svg';
import { ReactComponent as SearchIcon } from 'app/assets/icons/search.svg';
import utilStyles from 'app/styles/utils.module.css';
import { useSession } from 'app/contexts/SessionContext';
import ModalLink from 'app/components/ModalLink';

import AvatarMenu from './AvatarMenu';
import styles from './styles.module.css';

export type HeaderBackground = 'opaque' | 'transparent';

export type HeaderProps = {
  background?: HeaderBackground;
  scrollBackground?: HeaderBackground;
};

export default function Header({
  background = 'opaque',
  scrollBackground = 'opaque',
}: HeaderProps): JSX.Element {
  // We don't expect to have this multiple times per page but we should still be careful
  const [searchId] = useState(() => uniqueId('header-search-'));
  const { session } = useSession();
  const { y } = useWindowScroll();
  const { formatMessage } = useIntl();
  const displayBackground = y > 0 ? scrollBackground : background;

  return (
    <header className={[styles.header, styles[displayBackground]].join(' ')}>
      <nav
        className={[
          utilStyles.container,
          session ? styles.loggedIn : null,
          styles.container,
        ].join(' ')}>
        <NavLink to="/" className={styles.logo}>
          <img src={logo} />
        </NavLink>
        <ul className={styles.navList}>
          <li>
            <NavLink to="#">
              <FormattedMessage
                id="header.library"
                defaultMessage="Library"
                description="Link in header to view your own library"
              />
            </NavLink>
          </li>
          <li>
            <NavLink to="#">
              <FormattedMessage
                id="header.browse"
                defaultMessage="Browse"
                description="Dropdown in header to browse media"
              />
            </NavLink>
          </li>
          <li>
            <NavLink to="#">
              <FormattedMessage
                id="header.groups"
                description="Link in header to explore groups"
              />
            </NavLink>
          </li>
          <li>
            <NavLink to="#">
              <FormattedMessage
                id="header.feedback"
                description="Dropdown in header to provide feedback about Kitsu"
              />
            </NavLink>
          </li>
        </ul>
        <div className={styles.search}>
          <label htmlFor={searchId}>
            <SearchIcon className={styles.icon} />
          </label>
          <input
            type="search"
            placeholder={formatMessage({
              id: 'components.application.nav-search',
              defaultMessage: 'Search Kitsu',
              description: 'Placeholder text for search field',
            })}
            id={searchId}
          />
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
            <ModalLink to="/auth/sign-up">
              <FormattedMessage
                id="header.auth.sign-up"
                defaultMessage="Sign Up"
                description="Link in header to create an account"
              />
            </ModalLink>
            {' or '}
            <ModalLink to="/auth/sign-in">
              <FormattedMessage
                id="header.auth.sign-in"
                defaultMessage="Sign In"
                description="Link in header to sign in"
              />
            </ModalLink>
          </div>
        )}
      </nav>
    </header>
  );
}
