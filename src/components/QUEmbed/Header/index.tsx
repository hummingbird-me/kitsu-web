import React, { Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { ReactComponent as Logo } from 'app/assets/logo.svg';
import { useSession } from 'app/contexts/SessionContext';
import Spinner from 'app/components/Spinner';

// import AvatarMenu from './AvatarMenu';
import styles from './styles.module.css';

export type HeaderBackground = 'opaque' | 'transparent';

export default function Header(): JSX.Element {
  const { session, clearSession } = useSession();

  return (
    <>
      <header>
        <nav>
          <NavLink to="/" className={styles.logo}>
            <Logo />
          </NavLink>
          {session ? (
            <>
              <Suspense fallback={<Spinner />}>
                <NavLink to="/" onClick={clearSession}>
                  <FormattedMessage
                    id="header.user.logout"
                    defaultMessage="Log out"
                    description="Link in user menu to log out"
                  />
                </NavLink>
                {/* NOTE: need to add logout button to dropdown. We need our own QU Avatar Menu */}
                {/* <AvatarMenu className={styles.avatar} /> */}
              </Suspense>
            </>
          ) : (
            <div className={styles.authCta}>
              <NavLink to="/auth/sign-up">
                <FormattedMessage
                  id="header.auth.sign-up"
                  defaultMessage="Sign Up"
                  description="Link in header to create an account"
                />
              </NavLink>
              {' or '}
              <NavLink to="/auth/sign-in">
                <FormattedMessage
                  id="header.auth.sign-in"
                  defaultMessage="Sign In"
                  description="Link in header to sign in"
                />
              </NavLink>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
