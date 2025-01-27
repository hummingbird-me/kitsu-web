import { ErrorBoundary } from '@sentry/react';
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';
import invariant from 'tiny-invariant';

import Avatar from '@/components/content/Avatar';
import { NavLink } from '@/components/content/Link';
import { SpinnerBlock } from '@/components/feedback/Spinner';
import ModalLink from '@/components/ModalLink';
import { useAccount, type Account } from '@/contexts/AccountContext';
import { useRawSession, useSession } from '@/contexts/SessionContext';
import { paths } from '@/pages/routes';

import Menu from '../Menu';
import headerStyles from '../styles.module.css';
import styles from './styles.module.css';

export default function SessionInfo({ className }: { className: string }) {
  const session = useSession();
  const { fetching, profile } = useAccount();

  return (
    <div className={className}>
      <ErrorBoundary fallback={<Failed />}>
        {session.loggedIn ? (
          fetching ? (
            <Loading />
          ) : (
            <LoggedIn profile={profile} />
          )
        ) : (
          <LoggedOut />
        )}
      </ErrorBoundary>
    </div>
  );
}

function Loading() {
  return <SpinnerBlock className={headerStyles.circular} />;
}

function LoggedIn({ profile }: { profile: Account['profile'] }) {
  const { clearSession } = useRawSession();
  invariant(profile, 'Profile should always be present for LoggedIn');

  return (
    <Menu.Root>
      <Menu.Trigger className={styles.avatar} asChild>
        <Avatar
          size={25}
          source={profile.avatarImage}
          className={headerStyles.circular}
        />
      </Menu.Trigger>
      <Menu.Content>
        <ul>
          <li>
            <Menu.Link asChild>
              <NavLink to={paths.profile(profile)}>
                <FormattedMessage
                  id="header.user.profile"
                  defaultMessage="View Profile"
                  description="Link in user menu to view profile"
                />
              </NavLink>
            </Menu.Link>
          </li>
          <li>
            <Menu.Link asChild>
              <NavLink to="/settings">
                <FormattedMessage
                  id="header.user.settings"
                  defaultMessage="Settings"
                  description="Link in user menu to view settings"
                />
              </NavLink>
            </Menu.Link>
          </li>
          <li>
            <Menu.Link asChild>
              <NavLink to="/">
                <FormattedMessage
                  id="header.user.admin"
                  defaultMessage="Admin"
                  description="Link in user menu to view admin panel"
                />
              </NavLink>
            </Menu.Link>
          </li>
          <li>
            <Menu.Link asChild>
              <a href="#" onClick={clearSession}>
                <FormattedMessage
                  id="header.user.logout"
                  defaultMessage="Log out"
                  description="Link in user menu to log out"
                />
              </a>
            </Menu.Link>
          </li>
        </ul>
      </Menu.Content>
    </Menu.Root>
  );
}

function Failed() {
  return (
    <div className={headerStyles.circular}>
      <FaExclamationTriangle />
    </div>
  );
}

function LoggedOut() {
  return (
    <div>
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
  );
}
