import React from 'react';

import { useSession } from 'app/contexts/SessionContext';
import Image from 'app/components/Image';
import * as Dropdown from 'app/components/Dropdown';

import { useLoadProfileMenuQuery } from './loadProfileMenu-gql';
import styles from './styles.module.css';
import headerStyles from '../styles.module.css';
import { FormattedMessage } from 'react-intl';

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
              <FormattedMessage
                id="header.user.profile"
                defaultMessage="View Profile"
                description="Link in user menu to view profile"
              />
            </Dropdown.ItemLink>
            <Dropdown.ItemLink to="/">
              <FormattedMessage
                id="header.user.settings"
                defaultMessage="Settings"
                description="Link in user menu to view settings"
              />
            </Dropdown.ItemLink>
            <Dropdown.ItemLink to="/">
              <FormattedMessage
                id="header.user.admin"
                defaultMessage="Admin"
                description="Link in user menu to view admin panel"
              />
            </Dropdown.ItemLink>
            <Dropdown.Item onClick={clearSession}>
              <FormattedMessage
                id="header.user.logout"
                defaultMessage="Log out"
                description="Link in user menu to log out"
              />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Wrapper>
      )}
    </div>
  );
};

export default AvatarMenu;
