import React from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as Logo } from 'app/assets/logo.svg';
import ModalLink from 'app/components/ModalLink';

import styles from './styles.module.css';

const AuthModalHeader: React.FC<{
  email?: string;
  password?: string;
}> = function ({ email, password }) {
  const state = { email, password };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <nav>
        <ul className={styles.navList}>
          <li>
            <ModalLink
              component={NavLink}
              to={{ pathname: '/auth/sign-up', state }}
              className={styles.navLink}>
              Sign Up
            </ModalLink>
          </li>
          <li>
            <ModalLink
              component={NavLink}
              to={{ pathname: '/auth/sign-in', state }}
              className={styles.navLink}>
              Sign In
            </ModalLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AuthModalHeader;
