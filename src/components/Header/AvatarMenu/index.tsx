import React from 'react';
import { useLocation } from 'react-router-dom';

import { useSession } from 'app/contexts/SessionContext';
import Image from 'app/components/Image';
import * as Dropdown from 'app/components/Dropdown';

import { useLoadProfileMenuQuery } from './loadProfileMenu-gql';
import styles from './styles.module.css';
import headerStyles from '../styles.module.css';

const AvatarMenu: React.FC<{ className?: string }> = ({ className }) => {
  const { clearSession } = useSession();
  const { data, loading } = useLoadProfileMenuQuery();
  const profile = data?.currentAccount?.profile;

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
            <Dropdown.ItemLink to="/">Settings</Dropdown.ItemLink>
            <Dropdown.ItemLink to="/">Admin</Dropdown.ItemLink>
            <Dropdown.Item onClick={clearSession}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Wrapper>
      )}
    </div>
  );
};

export default AvatarMenu;
