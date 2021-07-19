import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import Image from 'app/components/Image';
import * as Dropdown from 'app/components/Dropdown';

import { useLoadProfileMenuQuery } from './loadProfileMenu-gql';
import styles from './styles.module.css';
import headerStyles from '../styles.module.css';

const AvatarMenu: React.FC<{ className?: string }> = ({ className }) => {
  const { data, loading } = useLoadProfileMenuQuery();
  const profile = data?.currentAccount?.profile;
  const location = useLocation();

  return (
    <div className={styles.avatar}>
      {loading ? (
        <div className={headerStyles.circular} />
      ) : (
        <Dropdown.Wrapper arrow={true} popperOptions={{ placement: 'bottom' }}>
          <Dropdown.Toggle>
            {profile?.avatarImage ? (
              <Image
                source={profile.avatarImage}
                height={25}
                width={25}
                blurhashSize={6}
                className={headerStyles.circular}
              />
            ) : null}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.ItemLink to={`/users/${profile?.slug ?? profile?.id}`}>
              View Profile
            </Dropdown.ItemLink>
            <Dropdown.ItemLink
              to={{
                pathname: '/auth/log-in',
                search: `?returnTo=${location.pathname}`,
                state: { background: location },
              }}>
              Sign in
            </Dropdown.ItemLink>
            <Dropdown.ItemLink to="/">Settings</Dropdown.ItemLink>
            <Dropdown.ItemLink to="/">Admin</Dropdown.ItemLink>
            <Dropdown.ItemLink to="/">Logout</Dropdown.ItemLink>
          </Dropdown.Menu>
        </Dropdown.Wrapper>
      )}
    </div>
  );
};

export default AvatarMenu;
