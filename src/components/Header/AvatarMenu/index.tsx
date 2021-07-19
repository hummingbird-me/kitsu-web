import React, { useState, useRef, useReducer } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Spinner from 'app/components/Spinner';
import useDropdown from 'app/hooks/useDropdown';
import { useSession } from 'app/contexts/SessionContext';

import { useLoadProfileMenuQuery } from './loadProfileMenu-gql';
import styles from './styles.module.css';
import headerStyles from '../styles.module.css';

const AvatarMenu: React.FC<{ className?: string }> = ({ className }) => {
  const session = useSession();
  const { data, loading } = useLoadProfileMenuQuery();
  const profile = data?.currentAccount?.profile;
  const location = useLocation();
  const { toggleProps, arrowProps, menuProps, itemProps } = useDropdown({
    placement: 'bottom',
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
  });

  return (
    <div className={styles.avatar}>
      {loading ? (
        <div className={headerStyles.circular} />
      ) : (
        <>
          <img
            {...toggleProps}
            src="https://media.kitsu.io/users/avatars/5554/small.jpeg?1597552193"
            className={headerStyles.circular}
          />
          <div {...menuProps} className={styles.menu}>
            <div {...arrowProps} className={styles.arrow} />
            <Link
              {...itemProps}
              to={{
                pathname: '/auth/log-in',
                search: `?returnTo=${location.pathname}`,
                state: { background: location },
              }}>
              Sign in
            </Link>
            <Link {...itemProps} to={`/users/${profile?.slug ?? profile?.id}`}>
              View Profile
            </Link>
            <Link {...itemProps} to="/">
              Settings
            </Link>
            <Link {...itemProps} to="/">
              Admin
            </Link>
            <Link {...itemProps} to="/">
              Logout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default AvatarMenu;
