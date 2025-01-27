import { NavigationMenu } from 'radix-ui';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import LogoImage from '@/assets/logo.svg?react';
import Container from '@/components/utils/Container';

import Background, { type HeaderBackground } from './Background';
import Menu from './Menu';
import SearchBox from './SearchBox';
import SessionInfo from './SessionInfo';
import styles from './styles.module.css';

export type HeaderProps = {
  background?: HeaderBackground;
  scrollBackground?: HeaderBackground;
};

function Logo({ className }: { className?: string }) {
  return (
    <NavLink to="/" className={className}>
      <LogoImage />
    </NavLink>
  );
}

export default function Header({
  background = 'opaque',
  scrollBackground = 'opaque',
}: HeaderProps) {
  return (
    <Background background={background} scrollBackground={scrollBackground}>
      <Container>
        <div className={styles.Container}>
          <Logo className={styles.Logo} />
          <ul className={styles.Navigation}>
            <li>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <NavLink to="#">
                    <FormattedMessage
                      id="header.library"
                      defaultMessage="Library"
                      description="Link in header to view your own library"
                    />
                  </NavLink>
                </Menu.Trigger>
                <Menu.Content>
                  <ul>
                    <li>Anime</li>
                    <li>Manga</li>
                  </ul>
                </Menu.Content>
              </Menu.Root>
            </li>
            <li>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <NavLink to="#">
                    <FormattedMessage
                      id="header.browse"
                      defaultMessage="Browse"
                      description="Dropdown in header to browse media"
                    />
                  </NavLink>
                </Menu.Trigger>
                <Menu.Content>
                  <ul>
                    <li>Anime</li>
                    <li>Manga</li>
                  </ul>
                </Menu.Content>
              </Menu.Root>
            </li>
            <li>
              <NavLink to="#">
                <FormattedMessage
                  id="header.groups"
                  defaultMessage="Groups"
                  description="Link in header to explore groups"
                />
              </NavLink>
            </li>
            <li>
              <NavLink to="#">
                <FormattedMessage
                  id="header.feedback"
                  defaultMessage="Feedback"
                  description="Dropdown in header to provide feedback about Kitsu"
                />
              </NavLink>
            </li>
          </ul>
          <SearchBox />
          <SessionInfo className={styles.SessionInfo} />
        </div>
      </Container>
    </Background>
  );
}
