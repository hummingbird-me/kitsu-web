import React from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as Logo } from 'app/assets/logo.svg';

import styles from './styles.module.css';

export default function AuthModalHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <nav>
        <ul className={styles.navList}>
          <li>
            <NavLink to="/auth/sign-up" className={styles.navLink}>
              Sign Up
            </NavLink>
          </li>
          <li>
            <NavLink to="/auth/log-in" className={styles.navLink}>
              Log In
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
